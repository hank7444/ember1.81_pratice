var sidemenuData = [

	{
		isOpen: true,
		isHidden: false,
        isPage: false,
        icon: 'icon-cogs',
        name: '營業人管理',
        page: [
            {
                isPage: true,
                isHidden: false,
                icon: 'icon-table',
                name: '營業人資料列表',
                page: {
                    href: 'companyList',
                    params: ' '
                } 
            },
            {
                isPage: true,
                icon: 'icon-table',
                name: '專案營業人設定',
                page: {
                    href: 'projectList',
                    params: ' '
                } 
            }
        ]
	},
	
	{
		isOpen: true,
        isPage: false,
        icon: 'icon-cogs',
        name: '測試menu layer1',
        page: [
            
            {
            	isOpen: true,
                isPage: false,
                icon: 'icon-table',
                name: '測試menu layer2',
                page: [

                	{
		                isPage: true,
		                isHidden: true,
		                icon: 'icon-table',
		                name: '測試menu layer3-1',
		                page: {
		                    href: 'companyList',
		                    params: ' '
		                } 
		            },
		            {
		            	isOpen: true,
		                isPage: false,
		                icon: 'icon-table',
		                name: '測試menu layer3-2',
		                page: [
		                	{
				                isPage: true,
				                icon: 'icon-table',
				                name: '測試menu layer4-1',
				                page: {
				                    href: 'companyList',
				                    params: ' '
				                } 
				            },
				            {
				                isPage: true,
				                icon: 'icon-table',
				                name: '測試menu layer4-2',
				                page: [
				                     	{
				                isPage: true,
				                icon: 'icon-table',
				                name: '測試menu layer4-1',
				                page: {
				                    href: 'companyList',
				                    params: ' '
				                } 
				            },
				                ]
				            }
		                ]
		            }
                ]
            }
        ]
	}
];

export default sidemenuData;