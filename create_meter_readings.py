import random

# set the inital random latitiude and longtitude
la = 10.369511810935023
ln = -61.22924773977311

lat = [la + random.uniform(-0.2, 0.2) for i in range(1, 100)]
lon = [ln + random.uniform(-0.2, 0.2) for i in range(1, 100)]
# generate 100 random integers
meter_ids = range(100, 199)

# generate the inital time to send meter readings
time = [random.randint(1, 10) for i in range(1, 100)]

# determine if the start start is 1 for on or 0 for false
pon_prob = [random.random() for i in range(1, 100)]
pon = [1 if x <= 0.9 else 0 for x in pon_prob]

with open("vals.txt", "a") as f:
    # generate the random data
    for i in range(1, 100):
        p_count = 0
        for mid in meter_ids:
            ran = random.random()

            # use markov chain
            # if it is 1 it means the meter is sending values
            if pon[p_count] == 1:
                if ran <= 0.9:
                    pon[p_count] = 1
                else:
                    pon[p_count] = 0
            # if it is 0 it means the meter is not sending values
            else:
                if ran <= 0.9:
                    pon[p_count] = 1
                else:
                    pon[p_count] = 0

            line = "db.session.add(Meter(meter_id={0}, latitude={1}, longitude={2}, reading={3}, time={4}))\n".format(mid, lat[p_count], lon[p_count], pon[p_count], time[p_count])
            f.write(line)
            p_count += 1
        time = [t + 10 for t in time]
