from collections import defaultdict

with open("words.txt") as f:
    words = f.read().split()

def get_signature(word):
    return "".join(sorted(word))

sigs = defaultdict(list)
for word in words:
    sigs[get_signature(word)].append(word)

letters = input("Enter the letters: ")
sig = get_signature(letters)
print(sigs[sig])
