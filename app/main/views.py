from flask import render_template, jsonify
from flask.ext.googlemaps import Map
from flask.ext.login import login_required
from . import main
# import random
# from .. import db
from ..models import Meter
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
@main.route('/get_data/<time>')
@login_required
def get_data(time):
    my_dict = {'lat': [], 'long': [], 'pon': [], 't': []}
    print type(time)
    t1 = int(time.encode('ascii', 'ignore'))
    t2 = t1 + 10

    all_meters = Meter.query.filter(Meter.time >= t1, Meter.time < t2)
    for a in all_meters:
        my_dict['lat'].append(a.latitude)
        my_dict['long'].append(a.longitude)
        my_dict['pon'].append(a.reading)
        my_dict['t'].append(a.time)
    return jsonify(my_dict)


@main.route('/get_data_points')
@login_required
def get_data_val():
    my_dict = {'lat': [], 'long': []}
    num = 1
    all_meters = Meter.query.all()
    for a in all_meters:
        my_dict['lat'].append(a.latitude)
        my_dict['long'].append(a.longitude)
        num += 1
        if num == 100:
            break

    return jsonify(my_dict)

# @main.route('/get_data')
# @login_required
# def get_data():
#     random.seed()
#     my_dict = {'lat': [], 'long': [], 'value': [], 'color': []}
#     my_dict['lat'] = [10.369511810935023, 10.3249536464279, 10.44845177450669, 10.315779911303764, 10.34928856232442, 10.474297381829183, 10.292645276490086, 10.404372122193637, 10.340457643581344, 10.375100230211661, 10.41610326401047, 10.437301562788798, 10.477611632080984, 10.292586126572925, 10.310528505409827, 10.344306112405816, 10.463373248907837, 10.393530436802482, 10.29673283522537, 10.45254757953238, 10.328593793737209, 10.291118973811725, 10.447330572885926, 10.390430747130555, 10.313671626994282, 10.358568963549619, 10.306317140378887, 10.30305516663687, 10.445223950404952, 10.370380300510298, 10.332830375228152, 10.407184554194833, 10.307630500866155, 10.316721561315926, 10.4479451348723, 10.37976067804487, 10.370676109798888, 10.426248640157928, 10.347618647552107, 10.373345185200204, 10.361851388368578, 10.418404643349703, 10.388804769775318, 10.387755938864283, 10.296288724762304, 10.376022252559288, 10.367821071629304, 10.39146740968463, 10.316893288106442, 10.477469639712188, 10.290797565957567, 10.390817690263242, 10.302282681068439, 10.374549666069765, 10.380745070161014, 10.371036162907425, 10.373151493854806, 10.463322307125464]
#     my_dict['long'] = [-61.22924773977311, -61.182201749728534, -61.214171493219766, -61.24073212807202, -61.29486666466272, -61.14555460149211, -61.17283379254275, -61.26854480281618, -61.20987303057301, -61.20769370290508, -61.31827037105756, -61.14838335019776, -61.22220063589066, -61.34405497116832, -61.156665545720834, -61.271636879667916, -61.28199323900871, -61.257659808475175, -61.22795675485962, -61.31358221632252, -61.262291958457034, -61.24554530027669, -61.21328781224818, -61.173840851845284, -61.231418904627375, -61.22460509057727, -61.18976345978544, -61.311593250841355, -61.1553272151553, -61.262049833650345, -61.28992532160689, -61.30917391785586, -61.253719028263795, -61.21512103375676, -61.189363722124924, -61.27535174875584, -61.343864285018135, -61.2785345554729, -61.32888099351596, -61.22829620653988, -61.17095689092052, -61.29658435163784, -61.162759236470684, -61.22444502625221, -61.24698877669565, -61.264640023986225, -61.22787899013312, -61.246886848241815, -61.256596636509286, -61.261831261356434, -61.34429991466353, -61.33475141163558, -61.32311471747461, -61.14632838684725, -61.25313794323832, -61.24464356303155, -61.19962295988667, -61.20529193053245]
#     for i in xrange(len(my_dict['lat'])):
#         val = random.randint(0, 100)
#         if val < 21:
#             my_dict['color'].append(1)
#         elif val > 89:  # assume this is PON
#             my_dict['color'].append(0)
#         else:
#             my_dict['color'].append(2)

#     return jsonify(my_dict)


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
