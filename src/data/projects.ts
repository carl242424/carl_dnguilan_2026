export interface ProjectImage {
	src: string;
	alt: string;
}

export interface Project {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	features?: string[];
	liveUrl?: string;
	githubUrl?: string;
	images: ProjectImage[];
}

export const projects: Project[] = [
	{
		id: 'car-rental-management',
		title: 'Car Rental Management',
		description:
			'A web-based car rental management system for handling vehicle inventory, bookings, customer records, and rental transactions.',
		technologies: ['Bootstrap', 'HTML', 'CSS', 'JavaScript', 'PHP'],
		features: [
			'Vehicle listing and availability tracking',
			'Customer booking and rental management',
			'Admin dashboard for fleet and transaction records',
		],
		liveUrl: '#',
		githubUrl: '#',
		images: [
			{
				src: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=675&fit=crop',
				alt: 'Car Rental Management homepage',
			},
			{
				src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=675&fit=crop',
				alt: 'Car Rental Management vehicle catalog',
			},
			{
				src: 'https://images.unsplash.com/photo-148529157115f-770bc44f7ee7?w=1200&h=675&fit=crop',
				alt: 'Car Rental Management booking interface',
			},
		],
	},
	{
		id: 'awak-kamay-scholar-management',
		title: 'Hawak Kamay Scholar Management System',
		description:
			'A scholar management system for organizing applicant records, scholarship programs, and student data with a modern React frontend and MongoDB backend.',
		technologies: ['React', 'MongoDB'],
		features: [
			'Scholar profile and application management',
			'Program tracking and status updates',
			'Centralized data storage with MongoDB',
		],
		liveUrl: '#',
		githubUrl: '#',
		images: [
			{
				src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=675&fit=crop',
				alt: 'Hawak Kamay Scholar Management System dashboard',
			},
			{
				src: 'https://images.unsplash.com/photo-1427504494784-876b86bfd049?w=1200&h=675&fit=crop',
				alt: 'Hawak Kamay Scholar Management System student records',
			},
			{
				src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=675&fit=crop',
				alt: 'Hawak Kamay Scholar Management System program overview',
			},
		],
	},
];
