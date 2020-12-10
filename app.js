'use strict';

const sizeOfAnArray = 10;
const fs = require('fs');

const g = (size = 10) => {
    let a = [];
    for(let i = 0; i < size; i++){
    a[i] = [];
    for(let j = 0; j < size; j++)
    a[i][j] = Math.floor((Math.random() * 2));
    }
    return a;
}

const theLess = (a) => {
    let less = {
        amount: a.length+1,
        index: 0,
    }
    for(let i = 0; i < a.length; i++){
        let sum = 0;
        for(let j = 0; j < a.length; j++){
            sum += a[i][j];
        }
        if(less.amount > sum){
            less.index = i;
            less.amount = sum;
        }
    }
    return less.index;
}

const exchangeR = (i, a) => {
    let temp = [];
    for(let j = 0; j < a.length; j++){
        temp[j] = a[0][j];
    }
    for(let j = 0; j < a.length; j++){
        a[0][j] = a[i][j];
    }
    for(let j = 0; j < a.length; j++){
        a[i][j] = temp[j];
    }
    return a;
}

const theMost = (a) => {
    let most = {
        amount: -1,
        index: 0,
    }
    for(let i = 0; i < a[0].length; i++){
        let sum = 0;
        for(let j = 0; j < a.length; j++){
            sum += a[j][i];
        }
        if(most.amount < sum){
            most.index = i;
            most.amount = sum;
        }
    }
    return most.index;
}

const exchangeC = (i, a) =>{
    let temp = [];
    for (let j = 0; j < a.length; j++){
        temp[j] = a[j][0];
    }
    for (let j = 0; j < a.length; j++){
        a[j][0] = a[j][i];
    }
    for (let j = 0; j < a.length; j++){
        a[j][i] = temp[j];
    }
    return a;
}

const beautify = (a) => {
    if(a.length < 1) 
    return 'empty';
    let str = '';
    str = '['
    for(let i = 0; i < a.length; i++){
        str += '['
        for(let j = 0; j < a.length; j++){
            if(j!==a.length-1){
                str += a[i][j] + ',';
            } else {
                str += a[i][j];
            }
        }
        if(i!==a.length-1){
            str += '],' + '\n'
        } else {
            str += ']]' + '\n'
        }
    }
    return str;
}

const deleteRow = (a) => {
    return a.shift();
}

const insertRow = (row, res) => {
    const row_i = (res.length - row.length);
    const col_i = res[row_i].length;
    let j = 0;
    for(let i = row_i; i < res.length; i++){
        res[row_i][col_i+j] = row[j];
        j++;
    }
    return res;
}

const deleteColumn = (a) => {
    let col = [];
    for(let i = 0; i < a.length; i++){
        col.push(a[i].shift());
    }
    return col;
}

const insertColumn = (column, res) => {
    const row_i = (res.length - column.length);
    const col_i = res[row_i].length;
    let j = 0;
    for(let i = row_i; i < res.length; i++){
        res[i][col_i] = column[j];
    }
    return res;
}

let a = g(sizeOfAnArray);
let res = [];
for(let i = 0; i < a.length; i++){
    res[i] = [];
}

console.log("INPUT MATRIX: \n", a);
fs.writeFileSync('before.txt', beautify(a), 'utf-8')
const iter = a.length;
for(let c = 0; c < iter; c++){
    let i = theLess(a)
    a = exchangeR(i, a)
    let row = deleteRow(a)
    res = insertRow(row, res)
    if(a[0]){
        i = theMost(a)
        a = exchangeC(i, a)
        let column = deleteColumn(a)
        res = insertColumn(column, res);
    }
}
console.log("OUTPUT MATRIX: \n", a);
console.log("RES MATRIX: \n", res);
fs.writeFileSync('after.txt', beautify(res), 'utf-8')