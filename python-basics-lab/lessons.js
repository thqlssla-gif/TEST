"use strict";
const STUDY_DATA = {
  "chapters": [
    {
      "id": 0,
      "title": "시작하기",
      "icon": "👋"
    },
    {
      "id": 1,
      "title": "변수와 자료형",
      "icon": "📦"
    },
    {
      "id": 2,
      "title": "연산자",
      "icon": "➗"
    },
    {
      "id": 3,
      "title": "문자열",
      "icon": "🔤"
    },
    {
      "id": 4,
      "title": "리스트",
      "icon": "📋"
    },
    {
      "id": 5,
      "title": "조건문",
      "icon": "🌿"
    },
    {
      "id": 6,
      "title": "반복문",
      "icon": "🔁"
    },
    {
      "id": 7,
      "title": "함수",
      "icon": "⚙️"
    },
    {
      "id": 8,
      "title": "딕셔너리",
      "icon": "🗂️"
    },
    {
      "id": 9,
      "title": "종합 실습",
      "icon": "🚀"
    }
  ],
  "lessons": [
    {
      "id": 1,
      "chapter": 0,
      "title": "안녕하세요, 파이썬!",
      "description": "가장 먼저 화면에 글자를 출력해 봐요.",
      "concept": "print()는 괄호 안의 값을 화면에 출력하는 함수예요. 글자는 따옴표로 감싸 주세요.",
      "example": "print(\"Hello, Python!\")",
      "prompt": "\"안녕하세요, 파이썬!\"을 화면에 정확하게 출력해 보세요.",
      "starter": "# print()를 사용해 보세요\n",
      "solution": "print(\"안녕하세요, 파이썬!\")",
      "hint": "print(\"출력할 내용\") 형태로 작성해 보세요.",
      "tests": [
        {
          "name": "인사말을 정확히 출력했나요?",
          "expr": "output.strip() == \"안녕하세요, 파이썬!\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 2,
      "chapter": 0,
      "title": "숫자 출력하기",
      "description": "숫자도 print()로 출력할 수 있어요.",
      "concept": "숫자는 문자열과 달리 따옴표 없이 적을 수 있어요. print(10)처럼 작성해 보세요.",
      "example": "print(100)\nprint(3.14)",
      "prompt": "숫자 2026을 한 줄에 출력해 보세요.",
      "starter": "# 숫자 출력\n",
      "solution": "print(2026)",
      "hint": "print(2026)처럼 숫자를 직접 넣어 보세요.",
      "tests": [
        {
          "name": "2026을 출력했나요?",
          "expr": "output.strip() == \"2026\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 3,
      "chapter": 0,
      "title": "두 줄 출력하기",
      "description": "print()를 여러 번 사용해 봐요.",
      "concept": "print() 한 번이 기본적으로 한 줄을 출력해요. 여러 번 사용하면 다음 줄에 결과가 나옵니다.",
      "example": "print(\"첫 줄\")\nprint(\"둘째 줄\")",
      "prompt": "첫 줄에는 \"파이썬\", 둘째 줄에는 \"재미있다\"를 출력하세요.",
      "starter": "# 아래에 print() 두 개를 작성하세요\n",
      "solution": "print(\"파이썬\")\nprint(\"재미있다\")",
      "hint": "print()를 두 번 작성해요.",
      "tests": [
        {
          "name": "두 줄이 순서대로 나왔나요?",
          "expr": "output.strip().splitlines() == [\"파이썬\", \"재미있다\"]"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 4,
      "chapter": 0,
      "title": "간단한 계산",
      "description": "print() 안에서도 계산이 가능해요.",
      "concept": "파이썬은 3 + 5 같은 계산식을 처리해요. print(3 + 5)라면 결과인 8이 출력됩니다.",
      "example": "print(7 + 2)  # 9",
      "prompt": "12 + 8의 계산 결과를 print()로 출력해 보세요.",
      "starter": "# 계산 결과 출력\n",
      "solution": "print(12 + 8)",
      "hint": "print(12 + 8)을 작성해 보세요.",
      "tests": [
        {
          "name": "결과가 20인가요?",
          "expr": "output.strip() == \"20\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 5,
      "chapter": 1,
      "title": "변수에 저장하기",
      "description": "이름표를 붙여 값을 보관해요.",
      "concept": "변수는 데이터를 저장하는 이름표예요. = 기호는 같다는 뜻이 아니라 오른쪽 값을 왼쪽 이름에 저장한다는 의미예요.",
      "example": "age = 20\nprint(age)",
      "prompt": "name 변수에 \"민수\"를 저장하고 name을 출력하세요.",
      "starter": "# name 변수를 만들어 보세요\n",
      "solution": "name = \"민수\"\nprint(name)",
      "hint": "name = \"민수\" 다음 print(name)을 사용하세요.",
      "tests": [
        {
          "name": "name에 민수가 저장됐나요?",
          "expr": "name == \"민수\""
        },
        {
          "name": "name이 출력되었나요?",
          "expr": "output.strip() == \"민수\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 6,
      "chapter": 1,
      "title": "변수의 값 바꾸기",
      "description": "한 번 저장한 값도 다시 바꿀 수 있어요.",
      "concept": "같은 변수에 다른 값을 대입하면 이전 값은 새 값으로 바뀝니다.",
      "example": "score = 50\nscore = 80\nprint(score)",
      "prompt": "score 변수에 50을 저장한 후 100으로 바꾸고 출력하세요.",
      "starter": "score = 50\n# 값을 바꾸세요\n",
      "solution": "score = 50\nscore = 100\nprint(score)",
      "hint": "score = 100을 한 번 더 작성하고 print(score)를 사용하세요.",
      "tests": [
        {
          "name": "score가 100인가요?",
          "expr": "score == 100"
        },
        {
          "name": "100이 출력되었나요?",
          "expr": "output.strip() == \"100\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 7,
      "chapter": 1,
      "title": "숫자와 글자 구분",
      "description": "정수와 문자열은 서로 다른 자료형이에요.",
      "concept": "int는 정수, str은 문자열이에요. type()을 사용하면 자료형을 확인할 수 있어요.",
      "example": "count = 3\nword = \"3\"\nprint(type(count))",
      "prompt": "age에는 정수 25, city에는 문자열 \"부산\"을 저장하세요.",
      "starter": "age = 0\ncity = \"\"\n",
      "solution": "age = 25\ncity = \"부산\"",
      "hint": "숫자에는 따옴표를 사용하지 않고, 글자에는 따옴표를 사용해요.",
      "tests": [
        {
          "name": "age가 정수 25인가요?",
          "expr": "age == 25 and type(age) is int"
        },
        {
          "name": "city가 문자열 부산인가요?",
          "expr": "city == \"부산\" and type(city) is str"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 8,
      "chapter": 1,
      "title": "형 변환하기",
      "description": "문자열을 숫자로 바꿔 계산해요.",
      "concept": "int(\"12\")는 문자열 \"12\"를 정수 12로 바꿔요. 반대로 str(12)는 문자열로 변환합니다.",
      "example": "text = \"30\"\nnumber = int(text)\nprint(number + 5)",
      "prompt": "text = \"40\"을 숫자로 변환해 number에 저장하고 2를 더한 값을 출력하세요.",
      "starter": "text = \"40\"\n# number를 만드세요\n",
      "solution": "text = \"40\"\nnumber = int(text)\nprint(number + 2)",
      "hint": "int(text)로 바꿔 number 변수에 대입하세요.",
      "tests": [
        {
          "name": "number가 40인가요?",
          "expr": "number == 40 and type(number) is int"
        },
        {
          "name": "42를 출력했나요?",
          "expr": "output.strip() == \"42\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 9,
      "chapter": 2,
      "title": "사칙연산 연습",
      "description": "기본 계산 연산자를 익혀요.",
      "concept": "+는 더하기, -는 빼기, *는 곱하기, /는 나누기예요. /의 결과는 소수형(float)이 됩니다.",
      "example": "print(6 * 7)\nprint(9 - 4)",
      "prompt": "a = 14, b = 5일 때 곱한 결과를 result에 저장하세요.",
      "starter": "a = 14\nb = 5\n# result = ?\n",
      "solution": "a = 14\nb = 5\nresult = a * b",
      "hint": "* 연산자로 곱셈을 해요.",
      "tests": [
        {
          "name": "곱셈 결과가 70인가요?",
          "expr": "result == 70"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 10,
      "chapter": 2,
      "title": "나머지 구하기",
      "description": "% 연산자를 사용해 봐요.",
      "concept": "%는 나머지 연산자예요. 10 % 3은 1이고, 짝수인지 판단할 때 자주 사용됩니다.",
      "example": "print(10 % 3)  # 1",
      "prompt": "17을 4로 나눈 나머지를 remainder 변수에 저장하세요.",
      "starter": "remainder = 0\n",
      "solution": "remainder = 17 % 4",
      "hint": "17 % 4를 계산해 보세요.",
      "tests": [
        {
          "name": "나머지가 1인가요?",
          "expr": "remainder == 1"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 11,
      "chapter": 2,
      "title": "몫과 제곱",
      "description": "//와 **를 써 봐요.",
      "concept": "//는 나눗셈의 몫(내림 나눗셈), **는 거듭제곱을 의미해요.",
      "example": "print(10 // 3)  # 3\nprint(2 ** 3)  # 8",
      "prompt": "7의 제곱을 square 변수에 저장하세요.",
      "starter": "square = 0\n",
      "solution": "square = 7 ** 2",
      "hint": "7 ** 2를 사용하세요.",
      "tests": [
        {
          "name": "square가 49인가요?",
          "expr": "square == 49"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 12,
      "chapter": 2,
      "title": "누적 계산하기",
      "description": "기존 값에 숫자를 더해요.",
      "concept": "+=는 기존 변수에 값을 더하고 다시 저장하는 간단한 문법이에요.",
      "example": "money = 1000\nmoney += 500\nprint(money)",
      "prompt": "total = 10에서 시작하여 += 로 5를 더한 뒤 total을 출력하세요.",
      "starter": "total = 10\n# += 사용\n",
      "solution": "total = 10\ntotal += 5\nprint(total)",
      "hint": "total += 5를 작성하세요.",
      "tests": [
        {
          "name": "total이 15인가요?",
          "expr": "total == 15"
        },
        {
          "name": "15를 출력했나요?",
          "expr": "output.strip() == \"15\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 13,
      "chapter": 3,
      "title": "문자열 합치기",
      "description": "글자와 글자를 이어 붙여요.",
      "concept": "문자열끼리 + 연산하면 하나의 문자열로 이어져요.",
      "example": "first = \"파이\"\nlast = \"썬\"\nprint(first + last)",
      "prompt": "first = \"안녕\", second = \"하세요\"를 합쳐 greeting 변수에 저장하세요.",
      "starter": "first = \"안녕\"\nsecond = \"하세요\"\n# greeting = ?\n",
      "solution": "first = \"안녕\"\nsecond = \"하세요\"\ngreeting = first + second",
      "hint": "문자열 + 문자열 = 이어 붙인 문자열이에요.",
      "tests": [
        {
          "name": "greeting이 안녕하세요인가요?",
          "expr": "greeting == \"안녕하세요\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 14,
      "chapter": 3,
      "title": "문자열 길이",
      "description": "len()으로 글자 수를 세요.",
      "concept": "len(문자열)은 공백을 포함한 문자열의 문자 개수를 알려 줍니다.",
      "example": "print(len(\"Python\"))  # 6",
      "prompt": "word = \"banana\"의 길이를 length에 저장하세요.",
      "starter": "word = \"banana\"\nlength = 0\n",
      "solution": "word = \"banana\"\nlength = len(word)",
      "hint": "len(word)를 사용하세요.",
      "tests": [
        {
          "name": "글자 수가 6인가요?",
          "expr": "length == 6"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 15,
      "chapter": 3,
      "title": "문자열 인덱싱",
      "description": "글자를 한 글자씩 꺼내요.",
      "concept": "문자열 첫 글자의 번호는 0이에요. name[0]은 첫 글자를 뜻합니다.",
      "example": "name = \"Python\"\nprint(name[0])  # P",
      "prompt": "text = \"파이썬\"에서 마지막 글자를 last에 저장하세요.",
      "starter": "text = \"파이썬\"\n# last = ?\n",
      "solution": "text = \"파이썬\"\nlast = text[-1]",
      "hint": "마지막 글자는 text[-1]로 가져올 수 있어요.",
      "tests": [
        {
          "name": "last가 썬인가요?",
          "expr": "last == \"썬\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 16,
      "chapter": 3,
      "title": "f-string 사용하기",
      "description": "변수 값을 문장에 자연스럽게 넣어 봐요.",
      "concept": "문자열 앞에 f를 쓰고 변수 이름을 중괄호로 감싸면 문자열 안에서 값을 사용할 수 있어요.",
      "example": "name = \"지민\"\nprint(f\"안녕, {name}!\")",
      "prompt": "name = \"수진\", age = 23을 사용해 정확히 \"수진의 나이는 23세\"를 출력하세요.",
      "starter": "name = \"수진\"\nage = 23\n# f-string으로 출력\n",
      "solution": "name = \"수진\"\nage = 23\nprint(f\"{name}의 나이는 {age}세\")",
      "hint": "f\"{name}의 나이는 {age}세\"를 사용하세요.",
      "tests": [
        {
          "name": "문장이 정확한가요?",
          "expr": "output.strip() == \"수진의 나이는 23세\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 17,
      "chapter": 4,
      "title": "리스트 만들기",
      "description": "여러 데이터를 한 번에 담아요.",
      "concept": "리스트는 []로 만들고 항목을 쉼표로 구분해요. 순서가 있는 자료형이에요.",
      "example": "fruits = [\"사과\", \"배\", \"귤\"]\nprint(fruits)",
      "prompt": "numbers에 10, 20, 30을 순서대로 담은 리스트를 만드세요.",
      "starter": "numbers = []\n",
      "solution": "numbers = [10, 20, 30]",
      "hint": "대괄호 안에 숫자를 쉼표로 구분하세요.",
      "tests": [
        {
          "name": "리스트가 정확한가요?",
          "expr": "numbers == [10, 20, 30] and type(numbers) is list"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 18,
      "chapter": 4,
      "title": "리스트 항목 꺼내기",
      "description": "인덱스를 사용해 값을 확인해요.",
      "concept": "리스트의 인덱스도 0부터 시작해요. fruits[1]은 두 번째 항목을 뜻합니다.",
      "example": "fruits = [\"사과\", \"배\"]\nprint(fruits[1])",
      "prompt": "fruits의 두 번째 과일을 favorite 변수에 저장하세요.",
      "starter": "fruits = [\"사과\", \"포도\", \"귤\"]\n# favorite = ?\n",
      "solution": "fruits = [\"사과\", \"포도\", \"귤\"]\nfavorite = fruits[1]",
      "hint": "리스트[1]은 두 번째 항목이에요.",
      "tests": [
        {
          "name": "두 번째 과일이 포도인가요?",
          "expr": "favorite == \"포도\""
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 19,
      "chapter": 4,
      "title": "리스트에 추가하기",
      "description": "append()로 새 항목을 넣어요.",
      "concept": "append(값)은 리스트 맨 끝에 항목을 추가합니다.",
      "example": "items = [1, 2]\nitems.append(3)\nprint(items)",
      "prompt": "colors에 \"초록\"을 마지막으로 추가하세요.",
      "starter": "colors = [\"빨강\", \"파랑\"]\n# 여기에 추가\n",
      "solution": "colors = [\"빨강\", \"파랑\"]\ncolors.append(\"초록\")",
      "hint": "colors.append(\"초록\")을 사용하세요.",
      "tests": [
        {
          "name": "세 가지 색이 순서대로 담겼나요?",
          "expr": "colors == [\"빨강\", \"파랑\", \"초록\"]"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 20,
      "chapter": 4,
      "title": "리스트 합계",
      "description": "sum()으로 합계를 계산해요.",
      "concept": "sum(숫자리스트)는 값들의 합계, len()은 개수를 구해요.",
      "example": "scores = [80, 90, 100]\nprint(sum(scores))",
      "prompt": "scores의 총합을 total에 저장하세요.",
      "starter": "scores = [70, 80, 90]\ntotal = 0\n",
      "solution": "scores = [70, 80, 90]\ntotal = sum(scores)",
      "hint": "sum(scores)를 사용하세요.",
      "tests": [
        {
          "name": "총합이 240인가요?",
          "expr": "total == 240"
        }
      ],
      "difficulty": "입문"
    },
    {
      "id": 21,
      "chapter": 5,
      "title": "if 조건문",
      "description": "조건에 따라 코드를 실행해요.",
      "concept": "if 뒤에는 True/False로 판단되는 조건이 와요. 조건이 참이면 들여쓰기된 코드를 실행합니다.",
      "example": "age = 20\nif age >= 19:\n    print(\"성인\")",
      "prompt": "age가 20 이상이면 \"통과\"를 출력하세요. age=22가 미리 주어집니다.",
      "starter": "age = 22\n# if문을 작성하세요\n",
      "solution": "age = 22\nif age >= 20:\n    print(\"통과\")",
      "hint": "if age >= 20: 다음 줄을 4칸 들여쓰기해요.",
      "tests": [
        {
          "name": "통과를 출력했나요?",
          "expr": "output.strip() == \"통과\""
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 22,
      "chapter": 5,
      "title": "if / else",
      "description": "조건이 거짓일 때도 처리해요.",
      "concept": "else는 if의 조건이 거짓인 경우에 실행되는 부분이에요.",
      "example": "num = 3\nif num % 2 == 0:\n    print(\"짝수\")\nelse:\n    print(\"홀수\")",
      "prompt": "number=7이 짝수면 \"짝수\", 아니면 \"홀수\"를 출력하세요.",
      "starter": "number = 7\n# 여기에 조건문 작성\n",
      "solution": "number = 7\nif number % 2 == 0:\n    print(\"짝수\")\nelse:\n    print(\"홀수\")",
      "hint": "number % 2 == 0이면 짝수예요.",
      "tests": [
        {
          "name": "홀수를 출력했나요?",
          "expr": "output.strip() == \"홀수\""
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 23,
      "chapter": 5,
      "title": "elif로 조건 추가",
      "description": "여러 조건 중 하나를 골라요.",
      "concept": "elif는 앞의 조건이 거짓일 때 다른 조건을 추가로 검사합니다.",
      "example": "score = 70\nif score >= 90:\n    grade = \"A\"\nelif score >= 70:\n    grade = \"B\"\nelse:\n    grade = \"C\"",
      "prompt": "score=85일 때 90 이상은 A, 80 이상은 B, 나머지는 C를 grade에 저장하세요.",
      "starter": "score = 85\ngrade = \"\"\n",
      "solution": "score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"",
      "hint": "90점 조건부터 검사하고 elif score >= 80을 작성하세요.",
      "tests": [
        {
          "name": "85점의 등급이 B인가요?",
          "expr": "grade == \"B\""
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 24,
      "chapter": 5,
      "title": "AND 조건",
      "description": "조건 두 가지가 모두 참인지 확인해요.",
      "concept": "and는 두 조건이 모두 참일 때 참이 됩니다. or는 하나라도 참이면 참이에요.",
      "example": "age = 20\nhas_ticket = True\nif age >= 18 and has_ticket:\n    print(\"입장 가능\")",
      "prompt": "age=21, has_ticket=True일 때 둘 다 충족하면 \"입장 가능\"을 출력하세요.",
      "starter": "age = 21\nhas_ticket = True\n",
      "solution": "age = 21\nhas_ticket = True\nif age >= 18 and has_ticket:\n    print(\"입장 가능\")",
      "hint": "if age >= 18 and has_ticket: 을 사용해요.",
      "tests": [
        {
          "name": "입장 가능한가요?",
          "expr": "output.strip() == \"입장 가능\""
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 25,
      "chapter": 6,
      "title": "for와 range",
      "description": "일정 횟수 반복하는 법을 배워요.",
      "concept": "range(1, 4)는 1, 2, 3을 만들어 줘요. 끝 숫자 4는 포함되지 않아요.",
      "example": "for i in range(1, 4):\n    print(i)",
      "prompt": "for문을 사용해 1, 2, 3을 한 줄씩 출력하세요.",
      "starter": "# for문 작성\n",
      "solution": "for i in range(1, 4):\n    print(i)",
      "hint": "range(1, 4)로 반복하세요.",
      "tests": [
        {
          "name": "1부터 3까지 출력했나요?",
          "expr": "output.strip().splitlines() == [\"1\", \"2\", \"3\"]"
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 26,
      "chapter": 6,
      "title": "리스트 순회",
      "description": "리스트의 항목을 하나씩 처리해요.",
      "concept": "for 과일 in fruits: 라고 쓰면 리스트 안의 값이 하나씩 과일 변수에 담깁니다.",
      "example": "fruits = [\"사과\", \"배\"]\nfor fruit in fruits:\n    print(fruit)",
      "prompt": "fruits의 모든 과일을 순서대로 한 줄씩 출력하세요.",
      "starter": "fruits = [\"사과\", \"배\", \"귤\"]\n",
      "solution": "fruits = [\"사과\", \"배\", \"귤\"]\nfor fruit in fruits:\n    print(fruit)",
      "hint": "for fruit in fruits: 다음 print(fruit)를 작성하세요.",
      "tests": [
        {
          "name": "모든 과일을 출력했나요?",
          "expr": "output.strip().splitlines() == [\"사과\", \"배\", \"귤\"]"
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 27,
      "chapter": 6,
      "title": "반복문으로 합계",
      "description": "값을 하나씩 누적해 봐요.",
      "concept": "반복문 안에서 total += n을 사용하면 값들이 순서대로 더해집니다.",
      "example": "total = 0\nfor n in [1, 2, 3]:\n    total += n",
      "prompt": "for문으로 1부터 5까지 더한 결과를 total에 저장하세요.",
      "starter": "total = 0\n# for 반복문\n",
      "solution": "total = 0\nfor n in range(1, 6):\n    total += n",
      "hint": "range(1, 6)을 돌면서 total += n을 해요.",
      "tests": [
        {
          "name": "합계가 15인가요?",
          "expr": "total == 15"
        }
      ],
      "difficulty": "중급"
    },
    {
      "id": 28,
      "chapter": 6,
      "title": "while 반복문",
      "description": "조건이 참인 동안 계속 실행해요.",
      "concept": "while은 조건이 참인 동안 반복해요. 반복 중 조건을 바꾸지 않으면 무한 반복되니 주의하세요.",
      "example": "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1",
      "prompt": "while을 사용해 1, 2, 3을 한 줄씩 출력하세요.",
      "starter": "count = 1\n# while 조건문\n",
      "solution": "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1",
      "hint": "while count <= 3: 아래 print(count), count += 1을 작성하세요.",
      "tests": [
        {
          "name": "1,2,3을 출력했나요?",
          "expr": "output.strip().splitlines() == [\"1\", \"2\", \"3\"]"
        }
      ],
      "difficulty": "중급"
    },
    {
      "id": 29,
      "chapter": 7,
      "title": "함수 만들기",
      "description": "코드를 묶어 재사용해요.",
      "concept": "def 함수이름(): 으로 함수를 정의하고 호출할 때는 함수이름()을 사용합니다.",
      "example": "def hello():\n    print(\"안녕!\")\nhello()",
      "prompt": "hello() 함수를 만들고 실행하면 \"안녕하세요\"를 출력하도록 작성하세요.",
      "starter": "# hello 함수 정의 및 호출\n",
      "solution": "def hello():\n    print(\"안녕하세요\")\n\nhello()",
      "hint": "def hello(): 다음 줄에 print()를 들여쓰기하고, 밖에서 hello()를 호출해요.",
      "tests": [
        {
          "name": "함수를 만들었나요?",
          "expr": "callable(hello)"
        },
        {
          "name": "인사말을 출력했나요?",
          "expr": "output.strip() == \"안녕하세요\""
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 30,
      "chapter": 7,
      "title": "매개변수 전달",
      "description": "함수에 값을 전달할 수 있어요.",
      "concept": "def greet(name): 처럼 괄호 안에 매개변수를 선언하면 호출할 때 값을 받을 수 있어요.",
      "example": "def greet(name):\n    print(\"안녕, \" + name)\ngreet(\"지수\")",
      "prompt": "greet(name) 함수를 만들어 \"안녕, 민지\"를 출력하도록 greet(\"민지\")를 호출하세요.",
      "starter": "# 함수 정의와 호출\n",
      "solution": "def greet(name):\n    print(\"안녕, \" + name)\n\ngreet(\"민지\")",
      "hint": "greet(name) 안에서 print(\"안녕, \" + name)를 써 보세요.",
      "tests": [
        {
          "name": "함수를 만들었나요?",
          "expr": "callable(greet)"
        },
        {
          "name": "민지에게 인사했나요?",
          "expr": "output.strip() == \"안녕, 민지\""
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 31,
      "chapter": 7,
      "title": "return 값 반환",
      "description": "계산 결과를 함수 밖으로 돌려줘요.",
      "concept": "return은 함수의 결과를 호출한 곳으로 전달합니다. print와 역할이 달라요.",
      "example": "def add(a, b):\n    return a + b\nresult = add(3, 4)",
      "prompt": "multiply(a,b) 함수를 만들고 두 수를 곱한 값을 return으로 반환하세요.",
      "starter": "def multiply(a, b):\n    # return 작성\n    pass\n",
      "solution": "def multiply(a, b):\n    return a * b",
      "hint": "함수 안에서 return a * b를 작성하세요.",
      "tests": [
        {
          "name": "2와 3을 곱하면 6인가요?",
          "expr": "multiply(2,3) == 6"
        },
        {
          "name": "4와 5를 곱하면 20인가요?",
          "expr": "multiply(4,5) == 20"
        }
      ],
      "difficulty": "중급"
    },
    {
      "id": 32,
      "chapter": 7,
      "title": "짝수 판별 함수",
      "description": "조건문과 함수를 결합해요.",
      "concept": "return은 참/거짓(True/False)도 돌려줄 수 있어요. 짝수라면 n % 2 == 0이 참이 됩니다.",
      "example": "def is_even(n):\n    return n % 2 == 0",
      "prompt": "is_even(n)을 정의해 짝수일 때 True, 홀수일 때 False를 반환하세요.",
      "starter": "def is_even(n):\n    pass\n",
      "solution": "def is_even(n):\n    return n % 2 == 0",
      "hint": "return n % 2 == 0 한 줄로 해결할 수 있어요.",
      "tests": [
        {
          "name": "4는 짝수인가요?",
          "expr": "is_even(4) is True"
        },
        {
          "name": "7은 홀수인가요?",
          "expr": "is_even(7) is False"
        },
        {
          "name": "0은 짝수인가요?",
          "expr": "is_even(0) is True"
        }
      ],
      "difficulty": "중급"
    },
    {
      "id": 33,
      "chapter": 8,
      "title": "딕셔너리 만들기",
      "description": "이름(key)과 값(value)을 연결해요.",
      "concept": "딕셔너리는 {\"키\": 값} 형태로 저장해요. 사람의 이름·나이처럼 정보를 묶을 때 유용합니다.",
      "example": "person = {\"name\": \"지수\", \"age\": 20}",
      "prompt": "student 딕셔너리를 만들고 name은 \"민호\", age는 19를 저장하세요.",
      "starter": "student = {}\n",
      "solution": "student = {\"name\": \"민호\", \"age\": 19}",
      "hint": "{ \"name\": \"민호\", \"age\": 19 }처럼 만들어요.",
      "tests": [
        {
          "name": "이름이 민호인가요?",
          "expr": "student[\"name\"] == \"민호\""
        },
        {
          "name": "나이가 19인가요?",
          "expr": "student[\"age\"] == 19"
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 34,
      "chapter": 8,
      "title": "키로 값 꺼내기",
      "description": "딕셔너리에서 원하는 정보를 조회해요.",
      "concept": "딕셔너리[\"키\"]를 사용하면 해당하는 값을 꺼낼 수 있어요.",
      "example": "book = {\"title\": \"파이썬\", \"price\": 12000}\nprint(book[\"title\"])",
      "prompt": "person의 city 값을 city 변수에 저장하세요.",
      "starter": "person = {\"name\": \"수아\", \"city\": \"부산\"}\ncity = \"\"\n",
      "solution": "person = {\"name\": \"수아\", \"city\": \"부산\"}\ncity = person[\"city\"]",
      "hint": "person[\"city\"]를 사용하세요.",
      "tests": [
        {
          "name": "city가 부산인가요?",
          "expr": "city == \"부산\""
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 35,
      "chapter": 8,
      "title": "딕셔너리 수정",
      "description": "새 정보를 추가하거나 바꿔 봐요.",
      "concept": "dictionary[\"key\"] = value 문법으로 기존 값을 수정하거나 새 키를 추가해요.",
      "example": "profile = {\"name\": \"철수\"}\nprofile[\"age\"] = 22",
      "prompt": "product의 price 값을 5000으로 수정하세요.",
      "starter": "product = {\"name\": \"연필\", \"price\": 3000}\n",
      "solution": "product = {\"name\": \"연필\", \"price\": 3000}\nproduct[\"price\"] = 5000",
      "hint": "product[\"price\"] = 5000을 사용하세요.",
      "tests": [
        {
          "name": "가격을 수정했나요?",
          "expr": "product[\"price\"] == 5000"
        }
      ],
      "difficulty": "기초"
    },
    {
      "id": 36,
      "chapter": 8,
      "title": "딕셔너리 순회",
      "description": "key와 value를 동시에 사용해요.",
      "concept": "items()로 딕셔너리의 키와 값을 함께 순회할 수 있어요.",
      "example": "data = {\"a\": 1, \"b\": 2}\nfor k, v in data.items():\n    print(k, v)",
      "prompt": "scores 딕셔너리의 모든 점수 합계를 total 변수에 저장하세요.",
      "starter": "scores = {\"수학\": 80, \"영어\": 90, \"국어\": 70}\ntotal = 0\n",
      "solution": "scores = {\"수학\": 80, \"영어\": 90, \"국어\": 70}\ntotal = 0\nfor score in scores.values():\n    total += score",
      "hint": "scores.values()를 반복하며 total에 더하세요. sum(scores.values())도 가능해요.",
      "tests": [
        {
          "name": "점수 합계가 240인가요?",
          "expr": "total == 240"
        }
      ],
      "difficulty": "중급"
    },
    {
      "id": 37,
      "chapter": 9,
      "title": "구구단 만들기",
      "description": "반복문과 계산을 함께 사용해요.",
      "concept": "반복문과 f-string을 결합하면 같은 형식의 문장을 여러 줄 출력할 수 있어요.",
      "example": "for i in range(1, 4):\n    print(f\"2 x {i} = {2*i}\")",
      "prompt": "3단을 3 x 1 = 3부터 3 x 9 = 27까지 한 줄씩 출력하세요.",
      "starter": "# 3단 만들기\n",
      "solution": "for i in range(1, 10):\n    print(f\"3 x {i} = {3*i}\")",
      "hint": "range(1, 10)과 f-string을 사용해요.",
      "tests": [
        {
          "name": "3단 9줄이 맞나요?",
          "expr": "output.strip().splitlines() == [f\"3 x {i} = {3*i}\" for i in range(1,10)]"
        }
      ],
      "difficulty": "중급"
    },
    {
      "id": 38,
      "chapter": 9,
      "title": "평균 점수 계산기",
      "description": "리스트와 계산을 복습해요.",
      "concept": "평균은 합계 ÷ 개수예요. sum()과 len()으로 간단히 계산할 수 있어요.",
      "example": "nums = [2, 4, 6]\navg = sum(nums) / len(nums)",
      "prompt": "scores=[80,90,100]의 평균을 average에 저장하세요.",
      "starter": "scores = [80, 90, 100]\naverage = 0\n",
      "solution": "scores = [80, 90, 100]\naverage = sum(scores) / len(scores)",
      "hint": "sum(scores) / len(scores)를 계산해요.",
      "tests": [
        {
          "name": "평균이 90인가요?",
          "expr": "average == 90"
        }
      ],
      "difficulty": "중급"
    },
    {
      "id": 39,
      "chapter": 9,
      "title": "가장 큰 수 찾기",
      "description": "반복문과 조건으로 최대값을 구해요.",
      "concept": "max() 함수 없이 직접 가장 큰 수를 찾을 수도 있어요. 현재 최대값과 새 값을 비교해 갱신해 보세요.",
      "example": "nums = [2, 8, 4]\nlargest = nums[0]\nfor n in nums:\n    if n > largest:\n        largest = n",
      "prompt": "numbers에서 가장 큰 값을 largest에 저장하세요. 이번에는 max()를 쓰지 않고 작성해 보세요.",
      "starter": "numbers = [13, 42, 7, 29]\nlargest = numbers[0]\n# 반복문 작성\n",
      "solution": "numbers = [13, 42, 7, 29]\nlargest = numbers[0]\nfor n in numbers:\n    if n > largest:\n        largest = n",
      "hint": "for문 안에서 if n > largest: 를 검사하고 largest를 변경해요.",
      "tests": [
        {
          "name": "가장 큰 수가 42인가요?",
          "expr": "largest == 42"
        }
      ],
      "difficulty": "중급"
    },
    {
      "id": 40,
      "chapter": 9,
      "title": "나만의 합계 함수",
      "description": "지금까지 배운 문법을 하나로!",
      "concept": "함수 안에서 반복문을 쓰고 return으로 최종 결과를 돌려주면 재사용 가능한 계산기가 됩니다.",
      "example": "def sum_list(nums):\n    return sum(nums)",
      "prompt": "sum_numbers(nums) 함수를 만들고 리스트에 담긴 숫자들의 합계를 반환하세요.",
      "starter": "def sum_numbers(nums):\n    # 합계를 반환해 보세요\n    pass\n",
      "solution": "def sum_numbers(nums):\n    total = 0\n    for n in nums:\n        total += n\n    return total",
      "hint": "for n in nums: 로 더한 뒤 return total을 작성하세요.",
      "tests": [
        {
          "name": "1,2,3의 합계가 6인가요?",
          "expr": "sum_numbers([1,2,3]) == 6"
        },
        {
          "name": "빈 리스트의 합계가 0인가요?",
          "expr": "sum_numbers([]) == 0"
        },
        {
          "name": "음수가 있어도 작동하나요?",
          "expr": "sum_numbers([-2,5,1]) == 4"
        }
      ],
      "difficulty": "도전"
    }
  ]
};