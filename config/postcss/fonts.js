module.exports = {
	formats: 'local woff woff2',
	display: "swap",
	custom: {
		"Montserat": {
			variants: {
				normal: {
					300: {
						url: {
							woff: "../fonts/montserrat-light.woff",
							woff2: "../fonts/montserrat-light.woff2"
						}
					},
					400: {
						url: {
							woff: "../fonts/montserrat-regular.woff",
							woff2: "../fonts/montserrat-regular.woff2"
						}
					},
					500: {
						url: {
							woff: "../fonts/montserrat-medium.woff",
							woff2: "../fonts/montserrat-medium.woff2"
						}
					}, 
					700: {
						url: {
							woff: "../fonts/montserrat-bold.woff",
							woff2: "../fonts/montserrat-bold.woff2"
						}
					}
				}
			}
		},
	}
}