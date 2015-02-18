# busstop
my cdp pro

от я к примеру делал расписание автобусов
[11/26/2014 1:59:27 PM] Darya Sabinina: а еще вот на прошлом проекте был таск ну мне он не достался, но суть была в том что он показывал такой таймер остчивающий обратное время до событи
[11/26/2014 1:59:27 PM] Konstantin Babichev: :)
[11/26/2014 1:59:34 PM] Darya Sabinina: брал дату с бэкэнда и щитал
[11/26/2014 1:59:52 PM] Konstantin Babichev: ну это просто таймер
[11/26/2014 1:59:58 PM] Konstantin Babichev: смотри...
[11/26/2014 2:00:01 PM] Darya Sabinina: смотрю)
[11/26/2014 2:00:11 PM] Konstantin Babichev: хочешь и вправду расписание траликов минских показывать?
[11/26/2014 2:00:21 PM] Darya Sabinina: нуууу
[11/26/2014 2:00:23 PM] Darya Sabinina: давааай оО
[11/26/2014 2:00:33 PM] Konstantin Babichev: не зажгло?)
[11/26/2014 2:00:47 PM] Darya Sabinina: нипанятна!
[11/26/2014 2:00:52 PM] Darya Sabinina: зажгло канешн
[11/26/2014 2:01:50 PM] Konstantin Babichev: https://dl.dropboxusercontent.com/u/136811407/pr-stops/index.html
[11/26/2014 2:02:11 PM] Darya Sabinina: бедный Константин, приходится ему с какими-то нестабильными джуниорами работать оО
[11/26/2014 2:02:15 PM] Konstantin Babichev: типа есть список остановок.
[11/26/2014 2:02:22 PM] Konstantin Babichev: у них есть автобусы.
[11/26/2014 2:02:37 PM] Konstantin Babichev: у них есть время прибытия на эту остановку
[11/26/2014 2:03:53 PM] Konstantin Babichev: и... ну и "фильтруешь" свою остановку и видишь когда что будет
[11/26/2014 2:04:16 PM] Darya Sabinina: а само расписание он прям с минсктранса тянет?
[11/26/2014 2:04:20 PM] Konstantin Babichev: неа)
[11/26/2014 2:04:33 PM] Konstantin Babichev: для этого надо было много больше времение
[11/26/2014 2:04:36 PM] Konstantin Babichev: собсна вот
[11/26/2014 2:04:38 PM] Konstantin Babichev: http://www.minsktrans.by/city/#minsk/bus
[11/26/2014 2:04:52 PM | Edited 2:04:55 PM] Konstantin Babichev: тут видно что можно поразному приходить к конечно цели
[11/26/2014 2:06:11 PM] Konstantin Babichev: а вот если глянуть сетевые запросы..... то там уже видны исходные данные (devil)
[11/26/2014 2:06:12 PM] Konstantin Babichev: http://www.minsktrans.by/city/minsk/times.txt
[11/26/2014 2:06:31 PM] Darya Sabinina: О_______________О
[11/26/2014 2:06:38 PM] Konstantin Babichev: (devil)
[11/26/2014 2:07:04 PM | Edited 2:07:19 PM] Konstantin Babichev: http://www.minsktrans.by/city/minsk/stops.txt
http://www.minsktrans.by/city/minsk/routes.txt
http://www.minsktrans.by/city/minsk/times.txt
[11/26/2014 2:07:26 PM] Konstantin Babichev: воооот :)
[11/26/2014 2:07:38 PM | Edited 2:07:41 PM] Darya Sabinina: это что за формат представления данных о_О
[11/26/2014 2:07:45 PM] Konstantin Babichev: в общем явно есть связь между этими 3 файликами
[11/26/2014 2:07:59 PM] Darya Sabinina: смотрю я в твой скрипт, вижу. ты сделал себе типа жсон и с него выводишь?
[11/26/2014 2:08:05 PM] Konstantin Babichev: я то да
[11/26/2014 2:08:58 PM] Darya Sabinina: но ребята из минсктранса пошли дальше...
[11/26/2014 2:09:05 PM] Konstantin Babichev: агах))
[11/26/2014 2:09:32 PM] Darya Sabinina: и вот это вот минсктранс расписание на скрипте?
[11/26/2014 2:09:48 PM] Konstantin Babichev: агах
[11/26/2014 2:10:15 PM] Konstantin Babichev: он сжирает эти 3 файлика, перегоняет их в 3 огромных массива/объекта
[11/26/2014 2:10:29 PM] Konstantin Babichev: и начинает туда/сюда по ним бегать
[11/26/2014 2:12:14 PM] Darya Sabinina: а, я поняла. мое задание взломать сайт минсктранса и поменять расписание для конкретного автобуса?)
[11/26/2014 2:14:15 PM] Konstantin Babichev: секундочку
[11/26/2014 2:14:28 PM] Konstantin Babichev: и вот в одной их жс-ке есть:
[11/26/2014 2:14:42 PM] Konstantin Babichev: this.city = city; 
this.stops_file = content[city].data + "stops.txt"; 
this.routes_file = content[city].data + "routes.txt"; 
this.times_file = content[city].data + "times.txt";
[11/26/2014 2:15:06 PM] Konstantin Babichev: т.е. да  - они загоняеют эти txt-шки в переменные и потом гоняют :)
[11/26/2014 2:15:24 PM] Konstantin Babichev: и поменять расписаниену что ты))
[11/26/2014 2:15:34 PM] Konstantin Babichev: мы же не перезапишем эти файлики.
[11/26/2014 2:18:12 PM] Darya Sabinina: я шутил( так это, вы хотите чтобы  вашу програму доработала этими файликами? •_•
[11/26/2014 2:21:39 PM] Konstantin Babichev: пока не)
[11/26/2014 2:21:51 PM] Darya Sabinina: (whew)
[11/26/2014 2:21:55 PM] Konstantin Babichev: пока ты накидай свой массив - как я накидывал
[11/26/2014 2:22:06 PM] Darya Sabinina: я уже думала отпуск брать на задание
[11/26/2014 2:22:06 PM] Konstantin Babichev: там просто на бэкбоне
[11/26/2014 2:22:15 PM] Konstantin Babichev: а ты на ангуляре накидай
[11/26/2014 2:22:30 PM] Konstantin Babichev: и тоже фильтрацию прикрути
[11/26/2014 2:23:12 PM] Konstantin Babichev: и чтобы по клику на остановку открывалось её описание - а там все времена.
[11/26/2014 2:23:33 PM | Edited 2:23:38 PM] Konstantin Babichev: (ибо при открытии видны только времена от сейчас до полуночи)
[11/26/2014 2:23:55 PM] Konstantin Babichev: в общем сайтетосик на англуря сделай пока :)
[11/26/2014 2:24:12 PM] Darya Sabinina: так не вкурил с описанием остановок ток
[11/26/2014 2:24:26 PM] Konstantin Babichev: ммм.
[11/26/2014 2:24:38 PM | Edited 2:24:42 PM] Konstantin Babichev: главный страница:
[11/26/2014 2:24:52 PM] Darya Sabinina: главный страниц
[11/26/2014 2:24:57 PM] Konstantin Babichev: ))
[11/26/2014 2:25:29 PM] Konstantin Babichev: 10 остановок.
в каждой из них автобусы которые проходят по ней
у жадого автобуса ближайший автобус
[11/26/2014 2:25:30 PM] Darya Sabinina: ааа, типа роуты?
[11/26/2014 2:25:52 PM] Darya Sabinina: или разворачивать?
[11/26/2014 2:25:58 PM] Konstantin Babichev: ммм
[11/26/2014 2:25:59 PM] Konstantin Babichev: не
[11/26/2014 2:26:08 PM] Konstantin Babichev: именно новая страница (devil)
[11/26/2014 2:26:23 PM] Darya Sabinina: ну как в бложике с постами было?
[11/26/2014 2:26:31 PM] Konstantin Babichev: агах
[11/26/2014 2:26:41 PM] Konstantin Babichev: а ну да
[11/26/2014 2:27:00 PM] Konstantin Babichev: только ещё докинь к каждой остновке "избранное"
[11/26/2014 2:27:06 PM] Darya Sabinina: а что оно делает?
[11/26/2014 2:27:09 PM] Darya Sabinina: я вот не поняла у тебя)
[11/26/2014 2:27:17 PM] Konstantin Babichev: и его можно будет потом в localStorage засовывать
[11/26/2014 2:27:24 PM] Konstantin Babichev: а нифига оно там не делает))
[11/26/2014 2:27:36 PM] Konstantin Babichev: оно в другом "прожекте" работает))
[11/26/2014 2:27:42 PM] Darya Sabinina: а)
[11/26/2014 2:28:35 PM] Konstantin Babichev: и ещё - не юзай бутсрап
[11/26/2014 2:28:36 PM] Konstantin Babichev: :)
[11/26/2014 2:28:57 PM] Darya Sabinina: почему?)
[11/26/2014 2:29:02 PM] Darya Sabinina: почему ты его так не любишь)
[11/26/2014 2:29:07 PM] Konstantin Babichev: а нафига он :)
[11/26/2014 2:29:43 PM] Konstantin Babichev: к примеру у тебя в ангуляр-блоге 1% от него юзался
[11/26/2014 2:29:50 PM] Konstantin Babichev: и ещё 5% ты перебивала
[11/26/2014 2:30:09 PM] Konstantin Babichev: ну да - сосбна ты его потом руками и перебивала
[11/26/2014 2:30:31 PM] Darya Sabinina: лоадно как скажите
[11/26/2014 2:30:51 PM] Darya Sabinina: так а это. вы таки щитаете что если я хорошо подтянусь в ангуляре то в джс чуть что тоже разрулюсь?
[11/26/2014 2:32:42 PM] Konstantin Babichev: в том то и прикол - там будет капелька ангуляра))
[11/26/2014 2:33:11 PM] Konstantin Babichev: основная движуха - массивами остановок/автобусов/времён оперировать
[11/26/2014 2:34:24 PM] Darya Sabinina: а ооп мне ннада?
[11/26/2014 2:34:33 PM] Konstantin Babichev: можешь
[11/26/2014 2:34:51 PM] Konstantin Babichev: ну ангуляр вынуждает дать делать

а давай ещё туда карты какнить всунем 
[1/19/2015 12:19:53 PM] Konstantin Babichev: гугл.мапс/яндекс.мапс
[1/19/2015 12:20:07 PM] Konstantin Babichev: чтонить отмечать на карте будем :)
[1/19/2015 12:22:52 PM] Darya Sabinina: оо, я попробую
[1/19/2015 12:22:53 PM] Darya Sabinina: ок)
[1/19/2015 12:23:04 PM] Darya Sabinina: вот с этим серсвисом совсем опыта нет)
[1/19/2015 12:23:20 PM] Darya Sabinina: у меня кстати на проекте вроде тож карты будут)
[1/19/2015 12:24:13 PM | Edited 12:24:15 PM] Konstantin Babichev: огонь
[1/19/2015 12:24:38 PM] Konstantin Babichev: так вот у нас там же список остановок транспорта, так?
[1/19/2015 12:24:53 PM] Konstantin Babichev: так вот давай для начала его захардкодим (5 остановок)
[1/19/2015 12:24:53 PM] Darya Sabinina: ну вот да, их и отмечать наверн?
[1/19/2015 12:25:37 PM] Konstantin Babichev: и захерачим кнопочку "показать на карте" (шота тип того) и по клику грузим карту и на неё тыкаем остановочки
[1/19/2015 12:25:50 PM] Konstantin Babichev: а там уже можно разгоняться выше крыши :)
[1/19/2015 12:26:12 PM] Konstantin Babichev: типа по клику на карту открывается попап и в нём ближайшие тралики
[1/19/2015 12:26:27 PM] Konstantin Babichev: а можно вообще с этого и начинать сайт
[1/19/2015 12:26:33 PM] Konstantin Babichev: главная - карта
[1/19/2015 12:31:37 PM] Konstantin Babichev: как тебе?
[1/19/2015 12:32:27 PM] Darya Sabinina: канешна ок
[1/19/2015 12:32:31 PM] Darya Sabinina: так и представляла
[1/19/2015 12:32:41 PM] Darya Sabinina: помоему на мисктрансе так и есть)
[1/19/2015 12:32:52 PM] Konstantin Babichev: вот фак :(
[1/19/2015 12:32:55 PM] Konstantin Babichev: не первые мы :)
[1/19/2015 12:33:30 PM] Konstantin Babichev: (он такой меееедленнй этот минсктранс)
[1/19/2015 12:33:30 PM] Darya Sabinina: ))
[1/19/2015 12:33:42 PM] Darya Sabinina: ну у нас то с пятью остановками точно быстрее все будет))
[1/19/2015 12:33:56 PM] Konstantin Babichev: а где у них?
[1/19/2015 12:34:19 PM] Darya Sabinina: сча
[1/19/2015 12:35:11 PM] Darya Sabinina: блин
[1/19/2015 12:35:16 PM] Darya Sabinina: я тебе похожу люто соврала
[1/19/2015 12:35:25 PM] Darya Sabinina: там есть линка "показать карту с остановками"
[1/19/2015 12:35:34 PM] Darya Sabinina: но крата нифига не интерактивная
[1/19/2015 12:35:44 PM] Darya Sabinina: возможно даже картинка?))
[1/19/2015 12:36:01 PM] Konstantin Babichev: http://www.minsktrans.by/ ?
[1/19/2015 12:36:24 PM] Darya Sabinina: http://clip2net.com/s/3aJxr6S
[1/19/2015 12:37:22 PM] Konstantin Babichev: у них просто ошибка в жс-е
[1/19/2015 12:37:32 PM] Konstantin Babichev: так-то может и работает
[1/19/2015 12:38:21 PM] Konstantin Babichev: ну да - вот они гугл.мапс гоняют
