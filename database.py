from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import asyncio

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String, primary_key=True)
    balance = Column(Float, default=0.0)

class Database:
    def __init__(self):
        self.engine = create_engine('sqlite:///bot.db')
        self.Session = sessionmaker(bind=self.engine)
        
    async def init_db(self):
        Base.metadata.create_all(self.engine)
    
    async def get_balance(self, user_id):
        session = self.Session()
        user = session.query(User).filter_by(id=str(user_id)).first()
        if not user:
            user = User(id=str(user_id), balance=0)
            session.add(user)
            session.commit()
        balance = user.balance
        session.close()
        return balance
    
    async def add_balance(self, user_id, amount):
        session = self.Session()
        user = session.query(User).filter_by(id=str(user_id)).first()
        if not user:
            user = User(id=str(user_id), balance=amount)
            session.add(user)
        else:
            user.balance += amount
        session.commit()
        session.close()
    
    async def transfer(self, from_id, to_id, amount):
        session = self.Session()
        sender = session.query(User).filter_by(id=str(from_id)).first()
        recipient = session.query(User).filter_by(id=str(to_id)).first()
        
        if not recipient:
            recipient = User(id=str(to_id), balance=0)
            session.add(recipient)
        
        sender.balance -= amount
        recipient.balance += amount
        
        session.commit()
        session.close()