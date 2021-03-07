---
layout: post
category: programmers
title: '코딩 테스트 - 스택/큐'
alias: stack-and-queue
author: Sally
published: true
comments: true
---

## 탑

### 문제

수평 직선에 탑 N대를 세웠습니다. 모든 탑의 꼭대기에는 신호를 송/수신하는 장치를 설치하였습니다. 발사한 신호는 신호를 보낸 탑보다 높은 탑에서만 수신합니다. 한 번 수신한 신호는 다른 탑으로 송신하지 않습니다.

예를 들어, 높이가 `6, 9, 5, 7, 4`인 5개 탑이 왼쪽으로 동시에 레이저 신호를 발사합니다. 그러면 탑은 다음과 같이 신호를 주고 받습니다. 높이가 `4`인 다섯 번째 탑에서 발사한 신호는 높이가 `7`인 네 번째 탑이 수신하고, 높이가 `7`인 네 번째 탑의 신호는 높이가 `9`인 두 번째 탑이, 높이가 `5`인 세 번째 탑의 신호도 높이가 `9`인 두 번째 탑이 수신합니다. 높이가 `9`인 두 번째 탑과 높이가 `6`인 첫 번째 탑이 보낸 레이저 신호는 어떤 탑에서도 수신할 수 없습니다.

|송신 탑(높이)|수신 탑(높이)|
|:---:|:---:|
|5(4)|4(7)|
|4(7)|2(9)|
|3(5)|2(9)|
|2(9)|-|
|1(6)|-|

맨 왼쪽부터 순서대로 탑의 높이를 담은 배열 `heights`가 매개 변수로 주어질 때 각 탑이 쏜 신호를 어느 탑에서 받았는지 기록한 배열을 return하도록 `solution` 함수를 작성해 주세요.

* `heights`는 길이 2 이상 100 이하인 정수 배열입니다.
* 모든 탑의 높이는 1 이상 100 이하입니다.
* 신호를 수신하는 탑이 없으면 0으로 표시합니다.

### 예시

|heights|return|
|:---:|:---:|
|`[6,9,5,7,4]`|`[0,0,2,2,4]`|
|`[3,9,9,3,5,7,2]`|`[0,0,0,3,3,3,6]`|
|`[1,5,3,6,7,6,5]`|`[0,0,2,0,0,5,6]`|

### 답안

```JS
function solution(heights) {
    var answer = [];

    for (var i = 0; i < heights.length; i++) {
        var n = 0;

        for (var j = i - 1; j >= 0; j--) {
            if (heights[j] > heights[i]) {
                n = j + 1;
                break;
            }
        }

        answer.push(n);
    }

    return answer;
}
```

## 다리를 지나는 트럭

### 문제

트럭 여러 대가 강을 가로지르는 1차선 다리를 정해진 순으로 건너려고 합니다. 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 알아내야 합니다. 트럭은 1초에 1만큼 움직이며 다리 길이는 `bridge_length`이고 무게 `weight`까지 견딥니다.

* 트럭이 다리에 완전히 오르지 않은 경우 이 트럭의 무게는 고려하지 않습니다.

예를 들어, 길이가 2이고 10kg 무게를 견디는 다리가 있습니다. 무게가 `[7, 4, 5, 6]kg`인 트럭이 순서대로 최단 시간 안에 다리를 건너려면 다음과 같이 건너야 합니다.

|경과 시간|다리를 지난 트럭|다리를 건너는 트럭|대기 트럭|
|:---:|---|---|---|
|0|[]|[]|[7, 4, 5, 6]|
|1|[]|[7]|[4, 5, 6]|
|2|[]|[7]|[4, 5, 6]|
|3|[7]|[4]|[5, 6]|
|4|[7]|[4, 5]|[6]|
|5|[7, 4]|[5]|[6]|
|6|[7, 4, 5]|[6]|[]|
|7|[7, 4, 5]|[6]|[]|
|8|[7, 4, 5, 6]|[]|[]

따라서, 모든 트럭이 다리를 건너려면 최소 **8초**가 걸립니다.

`solution` 함수의 매개 변수로 다리 길이 `bridge_length`, 다리가 견딜 수 있는 무게 `weight`, 트럭별 무게 `truck_weights`가 주어집니다. 이때 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 return하도록 `solution` 함수를 작성해 주세요.

* `bridge_length`는 1 이상 10,000 이하입니다.
* `weight`는 1 이상 10,000 이하입니다.
* `truck_weights`의 길이는 1 이상 10,000 이하입니다.
* 모든 트럭의 무게는 1 이상 `weight` 이하입니다.

### 예시

![02]

### 답안

```JS
function solution(bridge_length, weight, truck_weights) {
    var answer = 0;

    var queue_weights = [];
    var queue_weights_sum = 0;

    for (var i = 0; i < bridge_length; i++) {
        queue_weights.push(0);
    }

    var truck_weight = truck_weights.shift();

    queue_weights.shift();
    queue_weights.push(truck_weight);

    queue_weights_sum += truck_weight;

    answer++;

    while (queue_weights_sum > 0) {
        queue_weights_sum -= queue_weights.shift();

        if (truck_weights.length > 0) {
            if (queue_weights_sum + truck_weights[0] > weight) {
                queue_weights.push(0);
            } else {
                truck_weight = truck_weights.shift();

                queue_weights.push(truck_weight);
                queue_weights_sum += truck_weight;
            }
        }

        answer++;
    }

    return answer;
}
```

## 기능 개발

### 문제

프로그래머스 팀에서 기능 개선 작업을 수행 중입니다. 각 기능은 진도가 100%일 때 서비스에 반영할 수 있습니다.

각 기능의 개발 속도는 모두 다르기 때문에 뒤에 있는 기능이 앞에 있는 기능보다 먼저 개발을 완료할 수 있습니다. 뒤에 있는 기능은 앞에 있는 기능을 배포할 때 함께 배포합니다.

먼저 배포해야 하는 순서대로 작업의 진도가 적힌 정수 배열 `progresses`와 각 작업의 개발 속도가 적힌 정수 배열 `speeds`가 주어질 때 각 배포마다 몇 개의 기능을 배포하는지 return하도록 `solution` 함수를 작성해 주세요.

* 작업의 개수(`progresses`, `speeds` 배열의 길이)는 100개 이하입니다.
* 작업 진도는 100 미만의 자연수입니다.
* 작업 속도는 100 이하의 자연수입니다.
* 배포는 하루에 한 번만 할 수 있으며 하루의 끝에 이루어진다고 가정합니다. 예를 들어, 진도율이 95%인 작업의 개발 속도가 하루에 4%라면 배포는 2일 뒤에 이루어집니다.

### 예시

![03]

### 답안

```JS
function solution(progresses, speeds) {
    var answer = [];

    var due_days = progresses.map(function (progress, index) {
        return Math.ceil((100 - progress) / speeds[index]);
    });

    var due_day = due_days[0];

    for (var i = 0, j = 0; i < due_days.length; i++) {
        if (i == 0) {
            answer.push(1);
            continue;
        }

        if (due_days[i] <= due_day) {
            answer[j] += 1;
        } else {
            due_day = due_days[i];
            answer[++j] = 1;
        }
    }

    return answer;
}
```

## 프린터

### 문제

일반적인 프린터는 인쇄 요청이 들어온 순서대로 인쇄합니다. 그렇기 때문에 중요한 문서가 나중에 인쇄될 수 있습니다. 이런 문제를 보완하기 위해 중요도가 높은 문서를 먼저 인쇄하는 프린터를 개발했습니다. 이 새롭게 개발한 프린터는 아래와 같은 방식으로 인쇄 작업을 수행합니다.

1. 인쇄 대기 목록의 가장 앞에 있는 문서(J)를 대기 목록에서 꺼냅니다.
2. 나머지 인쇄 대기 목록에서 J보다 중요도가 높은 문서가 1개라도 존재하면 J를 대기 목록의 가장 마지막에 넣습니다.
3. 그렇지 않으면 J를 인쇄합니다.

예를 들어, 4개의 문서(A, B, C, D)가 순서대로 인쇄 대기 목록에 있고 중요도가 2 1 3 2 라면 C D A B 순으로 인쇄하게 됩니다.

내가 인쇄를 요청한 문서가 몇 번째로 인쇄되는지 알고 싶습니다. 위의 예에서 C는 1번째로, A는 3번째로 인쇄됩니다.

현재 대기 목록에 있는 문서의 중요도가 순서대로 담긴 배열 `priorities`와 내가 인쇄를 요청한 문서가 현재 대기 목록의 어떤 위치에 있는지를 알려 주는 `location`이 매개 변수로 주어질 때, 내가 인쇄를 요청한 문서가 몇 번째로 인쇄되는지 return하도록 `solution` 함수를 작성해 주세요.

* 현재 대기 목록에는 1개 이상 100개 이하의 문서가 있습니다.
* 인쇄 작업의 중요도는 1~9로 표현하며 숫자가 클수록 중요하다는 뜻입니다.
* `location`은 0 이상 (현재 대기 목록에 있는 작업 수 - 1) 이하의 값을 가지며 대기 목록의 가장 앞에 있으면 0, 두 번째에 있으면 1로 표현합니다.

### 예시

![04]

### 답안

```JS
function solution(priorities, location) {
    var answer = 1;
    var target_index = location;

    while (priorities.length > 0) {
        var first_value = priorities.shift();
        var is_max_value = priorities.every(function (value) {
            return value <= first_value;
        });

        if (is_max_value) {
            if (target_index == 0) break;
            answer++;
        } else {
            priorities.push(first_value);
        }

        if (target_index == 0) {
            target_index = priorities.length - 1;
        } else {
            target_index--;
        }
    }

    return answer;
}
```

[02]: {{ site.baseurl }}/assets/images/{{ page.category }}/{{ page.alias }}/02.jpg
[03]: {{ site.baseurl }}/assets/images/{{ page.category }}/{{ page.alias }}/03.jpg
[04]: {{ site.baseurl }}/assets/images/{{ page.category }}/{{ page.alias }}/04.jpg
