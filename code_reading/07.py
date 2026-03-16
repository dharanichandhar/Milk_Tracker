def total_value(cars):
    RATES = {'mustang': 2500000, 'ecosport': 1600000, 'bronco': 3500000}
    total = 0
    for model in cars:
        value = RATES[model]
        total = total + value
    return total

cars = []
model = input('Enter a car (or stop): ')
while model != 'stop':
    cars.append(model)
    model = input('Enter a car (or stop): ')

total = total_value(cars)
print(f'Total = {total}')
