QUnit.test( "TestSquare", function( assert ) {
    var result = APISearch("sorry");
    assert.equal( currentVideo, "fRh_vgS2dFE");
 });


 QUnit.test( "clearQueue", function( assert ) {
    var result = APISearch("hello");
    clearQueue();
    assert.equal( result, null);
 });
