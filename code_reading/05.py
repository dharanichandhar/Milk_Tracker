from functools import reduce

text = "Mud is some of nature's best medicine, and mucking through it in the Ford Bronco comes strongly recommended! The Bronco is the Ford answer to the longtime unchallenged success of the Jeep Wrangler. Like the Jeep, the Bronco comes in two- and four- door varieties, and it features both an optional manual transmission and four wheel drive. Even the most basic Bronco has plenty of pep from a 300 horse power turbocharged inline four with a 10 speed automatic transmission or an available seven speed manual to easily go through the worst mud slush. The wilder powertrain is a 330 horse power twin turbo V-6. The Bronco Raptor, reviewed separately, has 418 horse power but is a different beast entirely. Inside the Bronco is a rugged control room that is easy to clean up. Easy to drive on the street in between campsites, the Bronco proves to be equal parts fun lifestyle vehicle and proper mud crawling tool."

STOP_WORDS = {'is', 'of', 'and', 'it', 'in', 'the', 'to', 'it', 'an', 'most', 'has', 'from', 'a', 'be', 'up', 'on', 'that', 'but', 'with', 'both', 'like'}
PUNCTUATION = ".!'?,:-"

def count_words(words):
    counts = {}
    for word in words:
        try:
            counts[word] = counts[word] + 1
        except KeyError:
            counts[word] = 1
    return counts

def remove_punctuation(word):
    if word[-1] in PUNCTUATION:
        return word[:-1]
    return word

def print_counts(counts):
    for word in counts:
        print(f'{word} - {counts[word]} times')
 
def update_counts(acc, word):
    try:
        acc[word] = acc[word] + 1
    except KeyError:
        acc[word] = 1
    return acc

words = text.split()
words = [word.lower() for word in words]
words = [word for word in words if word not in STOP_WORDS]
words = [remove_punctuation(word) for word in words]
counts = reduce(update_counts, words, {})
print_counts(counts)

