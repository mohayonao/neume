import uop from "./_uop";

export default uop("midicps", a => 440 * Math.pow(2, (a - 69) / 12));
