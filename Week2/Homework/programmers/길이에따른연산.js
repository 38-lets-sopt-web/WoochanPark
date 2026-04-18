function solution(num_list) {
    const check = num_list.length > 10 ? 1 : 0;
    var answer = num_list[0];
    for (let i = 1; i < num_list.length; i++) {
        answer = check ? answer + num_list[i] : answer * num_list[i];
    }
    return answer;
}