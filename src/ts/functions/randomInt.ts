/** Функция генерация целого числа в заданном диапозоне *
* @param min: number - минимум
* @param max: number - максимум
* @return number - случайное число в заданном диапозоне
*/
function randomInt(min: number, max: number): number {
	var rand = min - 0.5 + Math.random() * (max - min + 1)
	rand = Math.round(rand);
	return rand;
}

export default randomInt