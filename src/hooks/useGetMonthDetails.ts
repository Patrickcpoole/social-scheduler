export const useGetMonthDetails = (currentMonth: Date) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startingDayOfWeek = firstDay.getDay();
  const totalDays = lastDay.getDate();

  return { year, month, firstDay, lastDay, startingDayOfWeek, totalDays };
};
