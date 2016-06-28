sm_ans = []  # smart meter anscestors
sm_pon = []  # smart meter pon
tr_ans = []
tr_pon = []
sb_ans = [1, 1]
sb_pon = [0, 0]
ps_pon = [0]

# 2 substation # transformer fault, 10(x2) transformers and 20(x20) meters

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

# # transformer fault
# tr_pon[0] = 1
# for i in range(0, 20):
#     sm_pon[i] = 1

# substation fault
# sb_pon[0] = 1
# for i in range(0, 1):
#     tr_pon[i] = 1
# for i in range(0, 20):
#     sm_pon[i] = 1

# # power generator fault
# ps_pon[0] = 1
# for i in range(0, 2):
#     sb_pon[i] = 1
# for i in range(0, 20):
#     tr_pon[i] = 1
# for i in range(0, 400):
#     sm_pon[i] = 1


def get_ancestor(idx, l):
    if l == 1:
        ansc = tr_ans[idx]
        return tr_pon[ansc]
    elif l == 2:
        ansc = sb_ans[idx]
        return sb_pon[idx]
    elif l == 3:
        return ps_pon[0]
    return 0


def get_new_s(l):
    if l == 1:
        return tr_pon
    elif l == 2:
        return sb_pon
    return ps_pon


if __name__ == '__main__':
    S = sm_pon
    F = 0
    L = 1
    faulty = {'level': '-1', 'index': '-1'}

    while F == 0:
        idx = 0
        for x in S:
            if x == 1:  # if there is a fault
                ancestor = get_ancestor(idx, L)  # check the ancestor
                if ancestor == 1:  # if there ansc is faulty keep going up tree
                    faulty['level'] = L
                    faulty['index'] = idx
                    S = get_new_s(L)
                    L += 1
                    break
                else:  # if the acestor is not faulty the current node is
                    faulty['level'] = L
                    faulty['index'] = idx
                    F = 1
                    break
            idx += 1

    print faulty
