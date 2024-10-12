const startOfToday = new Date(new Date().toDateString()).getTime();

export const filterTasksByDate = (tasks, filterType) => {
  return tasks.filter((task) => {
    const taskDate = new Date(task.date).getTime();

    switch (filterType) {
      case "past":
        return taskDate < startOfToday;
      case "today":
        return taskDate >= startOfToday && taskDate < startOfToday + 86400000;
      case "upcoming":
        return taskDate >= startOfToday + 86400000;
      default:
        return true;
    }
  });
};
