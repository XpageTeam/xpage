export default function partitionNumber(number: number): string{
	return number.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ")
}