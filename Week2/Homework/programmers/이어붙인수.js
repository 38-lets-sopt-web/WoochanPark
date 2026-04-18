function solution(num_list) {
    var answer = 0;
    let odds = "";
    let evens = "";
    for (let i = 0; i < num_list.length; i++) {
        if (num_list[i] % 2 == 0) {
            odds += num_list[i];
        } else {
            evens += num_list[i];
        }
    }

    return Number(odds) + Number(evens);
}