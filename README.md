(korean text)
autotwitt는 twitter의 본인 oauth 정보를 이용하여 자동으로 정해진 텍스트를 일정 시간별로 트윗하는 응용프로그램 입니다.


- 빨리 셋업하기 -

#1. Node.js 설치
http://nodejs.org

#2. Twiiter 계정 만들기
http://www.twitter.com

#3. Twitter API 등록
https://dev.twitter.com
	- My applicatios 클릭
	- Create a new application 버튼 클릭
		- Name, Description, WebSite에 적당한 값을 입력한 후 생성해줍니다.
	- Detais 페이지 하단의 Create my access token 버튼 클릭
		생성되면 Your access token에 Access token, Access token secret, Access level이 표시됩니다.
	- Access level을 Read and Write로 변경
		Settings 페이지에서 Application Type을 Read only에서 Read and Write로 변경해줍니다.
		그래야 자동으로 트윗할 수 있습니다.
		(참고: Allow this application to be used to Sign in with Twitter 체크해야 변경됨)

		

#4. Access token 생성

#5. twit 모듈 설치
Command line에서 npm(Node Package Manager)을 이용하여 아래 명령을 실행합니다.

  npm install twit

#6. config.json 파일생성
  아래는 Sample

{
	"allowTime": {"start":8, "end":0},	
	"interval": "2h",
	"infos":
	[
		{
			"wordFile": "word.txt",
			"oauth": {
				"id": "twitter.userid",
				"email": "email",
				"consumer_key": "4Vr7ehCpFXhO1Q2CbPWQ",
				"consumer_secret": "8k1oGKDRDHzfld601ms4zFc4T1OabFsKoWomA9oEUkU",
				"access_token": "62215924-CTv9WNfSeYid8xcO49wFxdkHJK7XGeKadEZmOHQoX",
				"access_token_secret": "orebUZPoaQSZoHTVG6W1Pli23MT0LJICtv4INQeAg9eik"
			}
		},
		{
			"wordFile": "word.txt",
			"oauth": {
				"id": "twitter.userid",
				"email": "email",
				"consumer_key": "3ad2312b1a123ddfdf12",
				"consumer_secret": "13123123kj123lkj123lkj123lkj123lkj123ljk12",
				"access_token": "12345678-abcdd12312312312312312312312312312312331",
				"access_token_secret": "123k123k123l1k23lk12j3lkj123lkj123lkj123lkjk"
			}
		}
	]
}

[설명(Description)]
	- allowTime.start : 자동 트윗 시작시간
	- allowTime.end : 자동 트윗 종료시간
	- interval: 60s, 10m, 2h, 5d와 같이 지정합니다. (s:초, m:분, h:시, d:일)
	- infos : 자동 트윗에 필요한 텍스트 파일과 Twitter oauth 정보 Array
	- infos[0] : 첫번째 정보 
	- infos[0].allowTime : allowTime은 전역으로 적용되고, infos[n].allowTime 지역으로 적용
	- infos[0].interval : 위 interval과 동일하지만 이것이 설정되면 위 interval은 무시됩니다. 즉, 지역이 전역보다 우선합니다.
		즉, 지역 allowTime이 있으면 이게 먼저 적용됨
	- infos[0].oauth : 첫번째 Twitter oauth 정보
	- ..oauth.id, email: 실제 사용되지 않으며 참고용

#7. word.txt 작성
config.json에 word.txt를 빈줄로 구분하여 작성한다.
아래와 같이 작성하면 3개의 트윗이 일정 주기로 트윗됩니다.

[sample word.txt]
첫번째 트윗 내용
입니다.

두번째...

세번째...

빈줄을 문구들이 구분됩니다.
