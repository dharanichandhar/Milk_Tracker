guess = None
min_number = 0
max_number = 99
while guess != "c":
    number = (min_number + max_number) // 2
    print("Is your number {}?".format(number))
    guess = input("[c / h / l] : ")
    if guess == "h":
        max_number = number - 1
    elif guess == "l":
        min_number = number + 1

