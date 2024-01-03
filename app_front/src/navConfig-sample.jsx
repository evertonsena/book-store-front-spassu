export default {
  items: [
    {
			name: 'Dashboard',
			url: '/',
			icon: 'icon-speedometer'
		},
		{
			name: 'Examples',
			url: '/Examples',
			icon: 'icon-folder-alt',
			children: [
				{
				  name: 'Cards',
				  url: '/Examples/Cards',
				  icon: 'icon-layers',
				},
				{
					name: 'Form Fields',
					url: '/Examples/FormField',
					icon: 'icon-grid',
				},
				{
					name: 'Cahrts',
					url: '/Examples/Charts',
					icon: 'icon-chart',
				}
			]
		}
  ]
}