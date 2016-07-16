describe('Date Picker Service', function () {
  var service;

  moment.locale('de');

  beforeEach(module('kt.components.datePicker'));

  beforeEach(inject(function (ktDatePickerSvc) {
    service = ktDatePickerSvc;
  }));

  describe('getNumberOfWeeksInMonth', function () {
    it('should return number of weeks in month', function () {
      expect(service.getNumberOfWeeksInMonth(2016,  0)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016,  1)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016,  2)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016,  3)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016,  4)).toEqual(6);
      expect(service.getNumberOfWeeksInMonth(2016,  5)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016,  6)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016,  7)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016,  8)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016,  9)).toEqual(6);
      expect(service.getNumberOfWeeksInMonth(2016, 10)).toEqual(5);
      expect(service.getNumberOfWeeksInMonth(2016, 11)).toEqual(5);
    });
  });

  describe('getWeekRangeForMonth', function () {
    it('should return start and end week for month', function () {
      expect(service.getWeekRangeForMonth(2016,  0)).toEqual({startWeek:  0, endWeek:  4});
      expect(service.getWeekRangeForMonth(2016,  1)).toEqual({startWeek:  5, endWeek:  9});
      expect(service.getWeekRangeForMonth(2016,  2)).toEqual({startWeek:  9, endWeek: 13});
      expect(service.getWeekRangeForMonth(2016,  3)).toEqual({startWeek: 13, endWeek: 17});
      expect(service.getWeekRangeForMonth(2016,  4)).toEqual({startWeek: 17, endWeek: 22});
      expect(service.getWeekRangeForMonth(2016,  5)).toEqual({startWeek: 22, endWeek: 26});
      expect(service.getWeekRangeForMonth(2016,  6)).toEqual({startWeek: 26, endWeek: 30});
      expect(service.getWeekRangeForMonth(2016,  7)).toEqual({startWeek: 31, endWeek: 35});
      expect(service.getWeekRangeForMonth(2016,  8)).toEqual({startWeek: 35, endWeek: 39});
      expect(service.getWeekRangeForMonth(2016,  9)).toEqual({startWeek: 39, endWeek: 44});
      expect(service.getWeekRangeForMonth(2016, 10)).toEqual({startWeek: 44, endWeek: 48});
      expect(service.getWeekRangeForMonth(2016, 11)).toEqual({startWeek: 48, endWeek: 52});
    });
  });
});
