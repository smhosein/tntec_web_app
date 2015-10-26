from app import db
from app.models import User

db.create_all()


db.session.add(User('admin@admin.com', 'admin', 1, 'admin'))

db.session.commit()