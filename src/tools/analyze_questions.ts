import { SEED_QUESTIONS } from '../data/questionBank';
import { SubjectId } from '../types';

function analyze() {
  const subjects: SubjectId[] = ['mathematics', 'physics', 'chemistry', 'biology', 'english'];
  
  let totalStored = 0;
  let verified = 0;
  let unverified = 0;
  
  // SEED_QUESTIONS was the main source.
  totalStored = SEED_QUESTIONS.length;
  
  SEED_QUESTIONS.forEach(q => {
    if (q.verificationStatus === 'VERIFIED_PAST_QUESTION') {
      verified++;
    } else {
      unverified++;
    }
  });

  console.log('--- Question Bank Analysis ---');
  console.log('Total Stored Questions:', totalStored);
  console.log('Verified Questions:', verified);
  console.log('Unverified Questions (includes AI_GENERATED and UNVERIFIED_SOURCE):', unverified);
  
  // If we only allow 'authentic' (which maps to VERIFIED_PAST_QUESTION)
  // we are likely only getting questions where verificationStatus is 'VERIFIED_PAST_QUESTION'.
}

analyze();
