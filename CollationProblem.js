// needed to print nested maps
const util = require('util')

// Initially I thought keys were fixed so didn't consider dynamic key value and just went to iterative approach.
// Iterative approach in this case becomes too complex since you have to deep dive on the nested values, so code becomes 
// too complicated to read and you have to keep on applying the children to the parent. sounds familiar? 
// Since this is a repetitive process, it's a good time to use recursive approach. Therefore since we used it in the exam
// earlier(thanks to that), I thought of doing a recursive approach of grouping the values of the child then assigning it to the parent key.


// Assumptions
// 1. When key doesn't exist, it stops on the latest iteration and returns the original list
// 2. When there are multiple records in a key, display array value, otherwise display single record as hash table

// this function simply groups a list by key
// it checks if list is object or array since we want 
// to return an object for single record, otherwise return array
const group_by = (key, list) => {
    // we need to check if record is an array value
    if (!list.length) {
        return list[key] ? new Map([[list[key], list]]) : list;
    }
    return list.reduce((map, thisRecord, _i, remaining) => {
        if (!thisRecord[key]) {
            // if key doesn't exist retain a copy to return list
            const retList = [...list]
            // then break iteration do we don't go to the succeeding records of the list
            remaining.splice(0);
            return retList;
        }

        const currRecord = map.get(thisRecord[key]);
        if (currRecord) {
            // if record is found, check if value is array
            if (currRecord.length) currRecord.push(thisRecord)
            else map.set(thisRecord[key], [currRecord, thisRecord])
        } else {
            // otherwise just set the record
            map.set(thisRecord[key], thisRecord)
        }
        return map;
        // used Map is default value since this is the HashTable equivalent of javascript
    }, new Map())
}

// Returns a string table of tables (up to length(keys) deep) of all source records collated as per keys
const collate_records = (keys, records) => {
    // if there is only 1 key, no need to do recursion
    if (keys.length === 1) return group_by(keys[0], records)

    // get key at index 0 and remove it from keys list
    const currentKey = keys.shift();
    const groupedRecords = group_by(currentKey, records);
    for (let key of groupedRecords.keys()) {
        groupedRecords.set(key, collate_records(keys, groupedRecords.get(key)));
    }
    return groupedRecords;

}

// Here we set our input values
const keys = ['region', 'name'];
const records = [
    { 'id': 1, 'name': 'obj-1', 'region': 'us' },
    { 'id': 2, 'name': 'obj-2', 'region': 'us' },
    { 'id': 3, 'name': 'obj-3', 'region': 'eu' },
];

// call collate_records then log result
console.log(util.inspect(collate_records(keys, records), false, null, true /* enable colors */))
