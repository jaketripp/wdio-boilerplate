describe('Grouping section name', function() {
  it('what the test should do', function () {
    browser.url('/');
    const title = browser.getTitle();
    expect(title).to.equal('localhost');
  })
})