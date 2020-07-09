let Arr = [22, 1, 2, 3];
function getPriorityArr(Arr) {
    let priorityValue;
    let priorityNum;
    let priorityArr;
    let q;
    for (q in Arr) {
        priorityValue = Arr[q];
        priorityNum = parseInt(q) + 1;
        priorityArr = { priorityNum: parseInt(q) + 1, val: Arr[q] };
        if (Arr[q] != null) {
            break;
        }
    }
    console.log(priorityValue);
    console.log(priorityNum);
    console.log(priorityArr);
}
let InputStartPosition = 2;
for (let i = InputStartPosition; i < 16; i++) {
    let inputValue = this.getInputData(i);
    if (inputValue != null) {
    }
}
//# sourceMappingURL=pri.js.map