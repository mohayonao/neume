import uop from "./_uop";

export default uop("rand2", a => (Math.random() * 2 - 1) * a);
