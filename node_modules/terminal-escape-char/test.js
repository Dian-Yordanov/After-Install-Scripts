var expect = require("chai").expect
var escapeChar = require("./index")

describe("Sample", function(){
  it("sample", function(){
    expect(escapeChar).to.equal("\u001b")
  })
})
