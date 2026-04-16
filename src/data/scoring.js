import { questions } from './questions';
import archetypes from './archetypes';

/**
 * Calculate archetype code from quiz answers
 * @param {Object} answers - { questionIndex: selectedOptionIndex }
 * @returns {{ code: string, scores: Object, percentages: Object, archetype: Object }}
 */
export function calculateArchetype(answers) {
  const dimensions = {
    execution: 0,
    data: 0,
    connection: 0,
    control: 0,
  };

  Object.entries(answers).forEach(([qIndex, optIndex]) => {
    const question = questions[parseInt(qIndex)];
    if (!question) return;
    const option = question.options[optIndex];
    if (!option) return;
    dimensions[question.dimension] += option.score;
  });

  // Each dimension has 3 questions, max score 9
  // Threshold at 5 (above midpoint)
  const code =
    (dimensions.execution >= 5 ? 'A' : 'M') +
    (dimensions.data >= 5 ? 'C' : 'F') +
    (dimensions.connection >= 5 ? 'I' : 'S') +
    (dimensions.control >= 5 ? 'P' : 'R');

  const percentages = {
    execution: Math.round((dimensions.execution / 9) * 100),
    data: Math.round((dimensions.data / 9) * 100),
    connection: Math.round((dimensions.connection / 9) * 100),
    control: Math.round((dimensions.control / 9) * 100),
  };

  const archetype = archetypes[code] || archetypes['MCSP'];

  return { code, scores: dimensions, percentages, archetype };
}
