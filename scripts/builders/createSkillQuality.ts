export const createSkillQuality = (skill: {
  name: string
  relative: string
  skillClass: string
}) => ({
  name: skill.name,
  relativePath: skill.relative,
  skillClass: skill.skillClass,
  score: 100,
  warnings: [],
})
