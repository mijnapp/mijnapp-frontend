const journeyVerhuizen = 'verhuizen';

const knownJourneys = [
  {
    name: journeyVerhuizen,
    id: '9d76fb58-0711-4437-acc4-9f4d9d403cdf',
  }];

export const getJourneyId = (journeyName) => {
  for (var journeyCounter = 0; journeyCounter < knownJourneys.length; journeyCounter++) {
    var journey = knownJourneys[journeyCounter];
    if (journey.name.toLowerCase() === journeyName.toLowerCase()) {
      return journey.id;
    }
  }

  return '9d76fb58-0711-4437-acc4-9f4d9d403cdf';
};

