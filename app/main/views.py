from flask import render_template, jsonify
from flask.ext.googlemaps import Map
from flask.ext.login import login_required
from . import main
import random
# from ..models import Comment


@main.route('/')
def index():
    mymap = Map(
        identifier="view-side",
        lat=10.383734,
        lng=-61.244866,
        markers=[],
        zoom=10
    )
    return render_template('index.html', mymap=mymap, wf=1)


@main.route('/data_vis')
@login_required
def data_vis():
    return render_template('data.html', wf=1)


# put value logic here!!!!!!!
@main.route('/get_data')
@login_required
def get_data():
    ran = random.randint(1, 100)
    my_dict = {'lat': [], 'long': []}
    for i in xrange(ran):
        my_dict['lat'].append(10.383734 + random.uniform(-0.1, 0.1))
        my_dict['long'].append(-61.244866 + random.uniform(-0.1, 0.1))
    return jsonify(my_dict)


@main.route('/get_data_val')
@login_required
def get_data_val():
    c_anom = random.randint(1, 100)
    c_nom = random.randint(1, 100)
    total = c_nom + c_anom
    lst = []
    for i in xrange(total):
        lst.append(random.uniform(0, 100))
    my_dict = {'count_anom': [c_anom], 'count_nom': [c_nom], 'value': lst}
    return jsonify(my_dict)


# @main.route('/map')
# def map():
#     return render_template('map.html')


# @main.route('/tmap')
# def tmap():
#     # creating a map in the view
#     mymap = Map(
#         identifier="view-side",
#         lat=37.4419,
#         lng=-122.1419,
#         markers=[]
#     )
#     return render_template('tmap.html', mymap=mymap)


# @main.route('/register-comment', methods=['GET', 'POST'])
# def register_comment():
#     form = RegistrationForm()
#     if form.validate_on_submit():
#         comment = Comment(email=form.email.data,
#                     username=form.username.data,
#                     password=form.password.data)
#         db.session.add(comment)
#         flash('Comment Added.')
#     return render_template('/', form=form)


# @main.route('/get-comments')
# def get_comments():
#     return render_template('map.html')
