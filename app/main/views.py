from __future__ import division
from flask import render_template, jsonify
from flask.ext.googlemaps import Map
from flask.ext.login import login_required
from . import main
import random
# from .. import db
from ..models import Meter
# from ..models import Comment

# sm_ans = []  # smart meter anscestors
# sm_pon = []  # smart meter pon
# tr_ans = []
# tr_pon = []
# sb_ans = [0, 0]
# sb_pon = [0, 0]
# ps_pon = [0]

outage = {'pon': [7, 40, 400, 510, 511, 532, 555, 561, 590, 598], 'time': []}
trans_outage = {'pon': [7], 'time': []}

pon = []
for i in range(0, 400):
    pon.append(0)

# # 2 substation # transformer fault, 10(x2) transformers and 20(x20) meters

# count = 0
# val = 0
# for i in range(0, 400):
#     sm_pon.append(0)
#     sm_ans.append(val)
#     count += 1
#     if count == 20:  # every 20 meters is a new transformer
#         count = 0
#         val += 1

# count = 0
# val = 0
# for i in range(0, 20):
#     tr_pon.append(0)
#     tr_ans.append(val)
#     count += 1
#     if count == 10:  # every 10 transformers is a new substation
#         count = 0
#         val += 1

# # transformer fault
# tr_pon[0] = 1
# for i in range(0, 20):
#     sm_pon[i] = 1

# substation fault
# sb_pon[0] = 1
# for i in range(0, 10):
#     tr_pon[i] = 1
# for i in range(0, 200):
#     sm_pon[i] = 1

# # power generator fault
# ps_pon[0] = 1
# for i in range(0, 2):
#     sb_pon[i] = 1
# for i in range(0, 20):
#     tr_pon[i] = 1
# for i in range(0, 400):
#     sm_pon[i] = 1


def get_ancestor(idx, l, tr_pon, sb_pon, ps_pon, tr_ans, sb_ans):
    if l == 1:
        ansc = tr_ans[idx]
        return tr_pon[ansc]
    elif l == 2:
        ansc = sb_ans[idx]
        return sb_pon[idx]
    elif l == 3:
        return ps_pon[0]
    return 0


def get_new_s(l, tr_pon, sb_pon, ps_pon):
    if l == 1:
        return tr_pon
    elif l == 2:
        return sb_pon
    return ps_pon


# get the lat and lon values for meters from lat_long.txt
def get_lat_long():
    lat = []
    lon = []

    with open("lat_long.txt", "r") as f:
        for line in f:
            line = line[:-1]
            lat_long = line.split()
            lat.append(lat_long[0])
            lon.append(lat_long[1])
    return lat, lon


# get the lat and lon value for stations from s_..._long.txt
def get_stat_lat_long():
    lat = []
    lon = []

    with open("stations_lat_long.txt", "r") as f:
        for line in f:
            line = line[:-1]
            lat_long = line.split()
            lat.append(lat_long[0])
            lon.append(lat_long[1])
    return lat, lon


def set_faulty_component(faulty, tr_pon, sb_pon, ps_pon):
    level = faulty['level']
    index = faulty['index']
    if level == 2:
        tr_pon[index] = -1
    elif level == 3:
        sb_pon[index] = -1
    else:
        ps_pon[0] = -1


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


# CCUs
@main.route('/get_data')
@login_required
def get_data():
    lat, lon = get_lat_long()
    my_dict = {'lat': lat, 'long': lon, 'pon': [], 'sub': []}

    # determine if any will fail
    for x in range(0, 400):
        r = random.random()
        if r < 0.7:
            pon[x] = 0
        else:
            pon[x] = 1

    my_dict['pon'] = pon
    count_s1 = 0
    count_s2 = 0
    for xx in range(0, 400):
        if xx < 200 and pon[x] == 1:
            count_s1 += 1
        elif pon[x] == 1:
            count_s2 += 1
    #see if 30% or more failed, if so then the ccu is bad
    if count_s1 / 200 >= 0.3:
        my_dict['sub'].append(1)
    if count_s2 / 200 >= 0.3:
        my_dict['sub'].append(2)
    print count_s1 / 200
    print count_s2 / 200
    return jsonify(my_dict)


# get the meter data points
@main.route('/get_outage')
@login_required
def get_outage():

    to_be_res = outage['pon']

    # remove meters in pon state with 99%
    for i in to_be_res:
        r = random.random()
        if r < 0.95:
            to_be_res.remove(i)

    # find all the meters that are not in pon list
    all_m = range(0, 400)
    aval = [x for x in all_m if x not in to_be_res]

    for i in aval:
        r = random.random()
        if r < 0.05:
            to_be_res.append(i)

    t = []
    for i in to_be_res:
        r = random.randint(1, 60)
        t.append(r)

    outage['pon'] = to_be_res
    outage['time'] = t
    cust = len(to_be_res)  # no of cutsomers with pons
    val = sum(t) / 400
    out_p = (cust / 400) * 100 # percent of customer with pons

    my_dict = {'val': val, 'cust': cust, 'out_p': out_p}
    return jsonify(my_dict)


# get the trandformer data points
@main.route('/get_trans_outage')
@login_required
def get_trans_outage():

    to_be_res = trans_outage['pon']

    # remove meters in pon state with 99%
    for i in to_be_res:
        r = random.random()
        if r < 0.999:
            to_be_res.remove(i)

    # find all the meters that are not in pon list
    all_m = range(0, 10)
    aval = [x for x in all_m if x not in to_be_res]

    for i in aval:
        r = random.random()
        if r < 0.001:
            to_be_res.append(i)

    t = []
    for i in to_be_res:
        r = random.randint(1, 60)
        t.append(r)

    trans_outage['pon'] = to_be_res
    trans_outage['time'] = t
    cust = len(to_be_res)  # no of cutsomers with pons
    out_p = (cust / 10) * 100  # percent of transformers with pons
    print out_p
    my_dict = {'out_p': out_p}
    return jsonify(my_dict)


# get the meter data points
@main.route('/get_data_points')
@login_required
def get_data_val():
    my_dict = {'lat': [], 'long': []}
    lat, lon = get_lat_long()

    my_dict['lat'] = lat
    my_dict['long'] = lon
    return jsonify(my_dict)


# get the stations data points
@main.route('/get_stations_points')
@login_required
def get_stations_val():
    my_dict = {'lat': [], 'long': []}
    lat, lon = get_stat_lat_long()

    my_dict['lat'] = lat
    my_dict['long'] = lon
    return jsonify(my_dict)


# get all the faults
@main.route('/get_faults')
@login_required
def get_faults():

    sm_ans = []  # smart meter anscestors
    sm_pon = []  # smart meter pon
    tr_ans = []
    tr_pon = []
    sb_ans = [0, 0]
    sb_pon = [0, 0]
    ps_pon = [0]

    count = 0
    val = 0
    for i in range(0, 400):
        sm_pon.append(0)
        sm_ans.append(val)
        count += 1
        if count == 20:  # every 20 meters is a new transformer
            count = 0
            val += 1

    count = 0
    val = 0
    for i in range(0, 20):
        tr_pon.append(0)
        tr_ans.append(val)
        count += 1
        if count == 10:  # every 10 transformers is a new substation
            count = 0
            val += 1

    r = random.randint(1, 6)

    if r == 1:  # tranformer faulty
        tr_pon[0] = 1
        for i in range(0, 20):
            sm_pon[i] = 1

    elif r == 2:  # substation fault
        sb_pon[0] = 1
        for i in range(0, 10):
            tr_pon[i] = 1
        for i in range(0, 200):
            sm_pon[i] = 1

    elif r == 3:  # power generator fault
        ps_pon[0] = 1
        for i in range(0, 2):
            sb_pon[i] = 1
        for i in range(0, 20):
            tr_pon[i] = 1
        for i in range(0, 400):
            sm_pon[i] = 1

    if r == 1 or r == 2 or r == 3:
        S = sm_pon
        F = 0
        L = 1
        faulty = {'level': '-1', 'index': '-1'}

        while F == 0:
            idx = 0
            for x in S:
                if x == 1:  # if there is a fault
                    ancestor = get_ancestor(idx, L, tr_pon, sb_pon, ps_pon, tr_ans, sb_ans)  # check the ancestor
                    if ancestor == 1:  # if there ansc is faulty keep going up tree
                        faulty['level'] = L
                        faulty['index'] = idx
                        S = get_new_s(L, tr_pon, sb_pon, ps_pon)
                        L += 1
                        break
                    else:  # if the acestor is not faulty the current node is
                        faulty['level'] = L
                        faulty['index'] = idx
                        F = 1
                        break
                idx += 1

        print faulty
        set_faulty_component(faulty, tr_pon, sb_pon, ps_pon)
        
    s_lat, s_lon = get_stat_lat_long()
    sm_lat, sm_lon = get_lat_long()

    my_dict = {'sm_pon': sm_pon, 'tr_pon': tr_pon, 'sb_pon': sb_pon, 'ps_pon': ps_pon, 'sm_lat': sm_lat, 'sm_lon': sm_lon, 's_lat': s_lat, 's_lon': s_lon}
    return jsonify(my_dict)


# @main.route('/get_data_points')
# @login_required
# def get_data_val():
#     my_dict = {'lat': [], 'long': []}
#     num = 1
#     all_meters = Meter.query.all()
#     for a in all_meters:
#         my_dict['lat'].append(a.latitude)
#         my_dict['long'].append(a.longitude)
#         num += 1
#         if num == 100:
#             break

#     return jsonify(my_dict)

# @main.route('/get_data/<time>')
# @login_required
# def get_data(time):
#     my_dict = {'lat': [], 'long': [], 'pon': [], 't': []}
#     print type(time)
#     t1 = int(time.encode('ascii', 'ignore'))
#     t2 = t1 + 10

#     all_meters = Meter.query.filter(Meter.time >= t1, Meter.time < t2)
#     for a in all_meters:
#         my_dict['lat'].append(a.latitude)
#         my_dict['long'].append(a.longitude)
#         my_dict['pon'].append(a.reading)
#         my_dict['t'].append(a.time)
#     return jsonify(my_dict)
