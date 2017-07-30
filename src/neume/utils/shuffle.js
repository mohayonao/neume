export default function shuffle(list) {
	list = list.slice();

  let len = list.length;

	while (len) {
    const rand = Math.floor(Math.random() * len--);
    const tmp = list[len];

    list[len] = list[rand];
		list[rand] = tmp;
	}

	return list;
}
