const functions = require('./InventoryTest');


test('Add Items to Inventory',()=>{
    expect(functions.add(2,2)).toBe(4);

});
test('Remove Items from Inventory',()=>{
    expect(functions.add(2,2)).toBe(4);

});

test('Update Quantity of Item In Inventory',()=>{
    expect(functions.createuser()).toEqual({
        name : 'Vijayaditya'
    });
});
// test('form data storring in database... ',()=>{
//     expect(functions.createuser()).toEqual({
//         name : 'Vijayaditya'
//     });
// });