from app import db, create_app
from app.models import User
import os


app = create_app(os.getenv('FLASK_CONFIG') or 'default')

db.create_all()


db.session.add(User('admin@admin.com', 'admin', 1, 'admin'))

db.session.commit()