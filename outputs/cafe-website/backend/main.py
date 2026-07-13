import os
import re
import sqlite3
from datetime import date, time
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator

app = FastAPI(title="知了 COFFEE")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
DB_FILE = os.path.join(os.path.dirname(__file__), "cafe.db")


def get_db():
    connection = sqlite3.connect(DB_FILE)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    connection = get_db()
    try:
        connection.execute("""CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL,
            date TEXT NOT NULL, time TEXT NOT NULL, guests INTEGER NOT NULL, notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
        connection.execute("""CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT,
            content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
        connection.commit()
    finally:
        connection.close()


class ReservationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    phone: str
    date: date
    time: time
    guests: int = Field(ge=1, le=20)
    notes: Optional[str] = Field(default=None, max_length=500)

    @field_validator("name")
    @classmethod
    def valid_name(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("请填写称呼")
        return value

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, value):
        value = value.strip()
        if not re.fullmatch(r"[0-9+()\s-]{7,20}", value):
            raise ValueError("请填写有效电话号码")
        return value

    @field_validator("date")
    @classmethod
    def future_date(cls, value):
        if value < date.today():
            raise ValueError("预约日期不能早于今天")
        return value

    @field_validator("time")
    @classmethod
    def opening_hours(cls, value):
        if not time(11, 0) <= value <= time(18, 30):
            raise ValueError("预约时间需在 11:00–18:30 之间")
        return value


class MessageCreate(BaseModel):
    name: str
    email: Optional[str] = None
    content: str


@app.post("/api/reservations")
def create_reservation(reservation: ReservationCreate):
    connection = None
    try:
        connection = get_db()
        cursor = connection.execute(
            "INSERT INTO reservations (name, phone, date, time, guests, notes) VALUES (?, ?, ?, ?, ?, ?)",
            (reservation.name, reservation.phone, reservation.date.isoformat(), reservation.time.strftime("%H:%M"), reservation.guests, reservation.notes),
        )
        connection.commit()
        return {"message": "预约成功", "status": "success", "id": cursor.lastrowid}
    except sqlite3.Error as error:
        raise HTTPException(status_code=500, detail="预约暂时无法保存，请稍后重试") from error
    finally:
        if connection is not None:
            connection.close()


@app.get("/api/reservations")
def get_reservations():
    connection = get_db()
    try:
        rows = connection.execute("SELECT * FROM reservations ORDER BY created_at DESC").fetchall()
        return [dict(row) for row in rows]
    finally:
        connection.close()


init_db()
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
