# from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask.ext.login import UserMixin
from . import db, login_manager


# class Role(db.Model):
#     __tablename__ = 'roles'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(64), unique=True)
#     users = db.relationship('User', backref='role', lazy='dynamic')

#     def __repr__(self):
#         return '<Role %r>' % self.name


class Meter(db.Model):
    __tablename__ = 'meters'
    id = db.Column(db.Integer, primary_key=True)
    meter_id = db.Column(db.Integer)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    reading = db.Column(db.Integer)
    time = db.Column(db.Integer)

    def __repr__(self):
        return '<Meter ID: %r>' % self.id


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    # role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128))
    # comments = db.relationship('Comment', backref='author', lazy='dynamic')

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User %r>' % self.username


# class Comment(UserMixin, db.Model):
#     __tablename__ = 'comments'
#     id = db.Column(db.Integer, primary_key=True)
#     body = db.Column(db.Text)
#     # timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
#     username = db.Column(db.String(64), unique=True, index=True)
#     author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

#     @property
#     def password(self):
#         raise AttributeError('password is not a readable attribute')

#     @password.setter
#     def password(self, password):
#         self.password_hash = generate_password_hash(password)

#     def verify_password(self, password):
#         return check_password_hash(self.password_hash, password)

#     def __repr__(self):
#         return '<User %r>' % self.username


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
