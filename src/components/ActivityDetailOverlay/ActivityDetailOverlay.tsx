import { BASE_PATH } from '../../constants';
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { XIcon, HeartIcon } from "lucide-react";

interface ActivityDetailOverlayProps {
  onClose: () => void;
  activityId?: string;
}

const activityDetails = {
  '1': {
    title: 'Fingerprint Ladybug Fun',
    subtitle: 'Create adorable ladybugs using fingerprints',
    ageRange: '24m - 36m',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Susannah Sta',
    authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: 'Aug 28 2025',
    materials: [
      'Non-toxic washable paint (red and black)',
      'White paper',
      'Wipes or damp cloths for cleanup',
      'Smocks or old shirts to protect clothing',
      'Fine paintbrushes for details'
    ],
    instructions: [
      'Gather all materials needed for the activity, ensuring a clean and safe work surface.',
      'Ask each child to put on a smock or an old shirt to protect their clothing from paint.',
      'Pour small amounts of red and black paint onto a palette or plate for easy access.',
      'Show the children how to dip their thumb into red paint and press it onto the paper to create the ladybug body.',
      'Help them add a black fingerprint for the head, then use a fine brush to add spots, legs, and antennae.',
      'Allow the artwork to dry completely before displaying or sending home with the children.'
    ]
  },
  '5': {
    title: 'Bug Hunt Adventure',
    subtitle: 'Explore and discover insects in the garden',
    ageRange: '24m - 36m',
    image: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Claire Potter',
  authorAvatar: `${BASE_PATH}frame-12.png`,
    date: 'Aug 29 2025',
    materials: [
      'Magnifying glasses',
      'Small collection containers',
      'Bug identification chart',
      'Clipboards with paper',
      'Crayons or pencils',
      'Hand sanitizer'
    ],
    instructions: [
      'Prepare magnifying glasses and collection containers for each child.',
      'Show children the bug identification chart and explain what insects they might find.',
      'Lead the group to the outdoor garden or playground area.',
      'Encourage children to look under leaves, rocks, and in flower beds for insects.',
      'Help them observe bugs through magnifying glasses without touching them.',
      'Have children draw or mark what they found on their clipboards.',
      'Discuss the different bugs found and their characteristics back in the classroom.'
    ]
  },
  '8': {
    title: 'Butterfly Coffee Filter Art',
    subtitle: 'Create beautiful butterflies with coffee filters',
    ageRange: '24m - 36m',
    image: 'https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Emma Rodriguez',
    authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: 'Aug 30 2025',
    materials: [
      'Round coffee filters',
      'Washable markers',
      'Spray bottles with water',
      'Clothespins',
      'Pipe cleaners',
      'Newspaper or plastic tablecloth'
    ],
    instructions: [
      'Cover work area with newspaper or plastic tablecloth to protect surfaces.',
      'Give each child a coffee filter and several washable markers.',
      'Show children how to color the coffee filter with markers, making dots and lines.',
      'Once colored, lightly spray the coffee filter with water to watch colors blend.',
      'Allow filters to dry completely on a flat surface.',
      'Help children pinch the center of the dried filter and secure with a clothespin.',
      'Wrap a pipe cleaner around the clothespin to create butterfly antennae.'
    ]
  },
  '11': {
    title: 'Caterpillar Egg Carton Craft',
    subtitle: 'Transform egg cartons into cute caterpillars',
    ageRange: '24m - 36m',
    image: 'https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Marcus Thompson',
    authorAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: 'Sep 1 2025',
    materials: [
      'Cardboard egg cartons',
      'Green tempera paint',
      'Paintbrushes',
      'Googly eyes',
      'Pipe cleaners',
      'Glue sticks',
      'Scissors (adult use only)'
    ],
    instructions: [
      'Pre-cut egg carton strips with 4-6 cups connected for each child.',
      'Set up painting station with green paint and brushes.',
      'Help children paint their egg carton strips green and let dry.',
      'Once dry, assist children in gluing googly eyes to the first cup (caterpillar head).',
      'Help them poke small holes in the head section for pipe cleaner antennae.',
      'Insert pipe cleaners and curl the ends to create antennae.',
      'Encourage children to name their caterpillars and create stories about them.'
    ]
  },
  '13': {
    title: 'Garden Bug Exploration',
    subtitle: 'Discover and learn about garden insects',
    ageRange: '24m - 36m',
    image: 'https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Olivia Wilson',
    authorAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: 'Sep 2 2025',
    materials: [
      'Bug observation sheets',
      'Magnifying glasses',
      'Small notebooks',
      'Colored pencils',
      'Bug identification guide',
      'Collection jars (for observation only)',
      'Hand wipes'
    ],
    instructions: [
      'Prepare observation sheets and materials for each child.',
      'Review the bug identification guide with children before going outside.',
      'Lead children to the garden area and establish boundaries for exploration.',
      'Encourage children to look carefully under leaves and around flowers.',
      'Help them use magnifying glasses to observe insects closely.',
      'Guide children to draw what they see in their notebooks.',
      'Discuss findings as a group and identify the bugs using the guide.',
      'Emphasize being gentle with nature and not harming any insects.'
    ]
  },
  'pumpkin-carving': {
    title: 'Pumpkin Carving Fun',
    subtitle: 'Safe pumpkin decorating for little hands',
    ageRange: '24m - 36m',
    image: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Claire Potter',
  authorAvatar: `${BASE_PATH}frame-12.png`,
    date: 'Oct 30 2025',
    materials: [
      'Small pumpkins (one per child)',
      'Child-safe plastic carving tools',
      'Washable markers',
      'Stickers and decorative materials',
      'Newspaper or plastic tablecloth',
      'Wet wipes for cleanup'
    ],
    instructions: [
      'Cover work area with newspaper or plastic tablecloth for easy cleanup.',
      'Give each child a small pumpkin and let them explore its texture and shape.',
      'Show children how to use washable markers to draw faces or patterns on their pumpkins.',
      'Help children use child-safe plastic tools to make small indentations (no actual cutting).',
      'Encourage children to decorate with stickers and other safe materials.',
      'Let children add their own creative touches to make each pumpkin unique.',
      'Display finished pumpkins and take photos to share with families.'
    ]
  }
};

export const ActivityDetailOverlay: React.FC<ActivityDetailOverlayProps> = ({ onClose, activityId = '1' }): JSX.Element => {
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const activity = activityDetails[activityId as keyof typeof activityDetails] || activityDetails['1'];
  
  const existingComments = [
    {
      id: '1',
      author: 'Sarah Martinez',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: activityId === '5' ? 'The kids had so much fun exploring! Tommy found three different types of beetles.' : 
            activityId === '8' ? 'The coffee filter butterflies turned out so beautiful! Emma was amazed by the color mixing.' :
            activityId === '11' ? 'Such a creative way to reuse egg cartons! The caterpillars are adorable.' :
            activityId === '13' ? 'Great way to teach respect for nature while learning about insects.' :
            'This is so simple but my daughter spent over an hour making different kinds of bugs with her fingertips! She loved it 🐞',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      author: 'Michael Johnson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: activityId === '5' ? 'Perfect for developing observation skills. Great outdoor activity!' :
            activityId === '8' ? 'The science behind the color blending was fascinating for the kids.' :
            activityId === '11' ? 'Love how this combines creativity with environmental awareness.' :
            activityId === '13' ? 'My daughter came home with so many interesting facts about bugs!' :
            'What a creative way to teach about insects! Tommy came home so excited to show me his ladybug.',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      author: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      text: activityId === '5' ? 'The magnifying glasses were a huge hit! Great for curious minds.' :
            activityId === '8' ? 'Beautiful results and the kids learned about color mixing too.' :
            activityId === '11' ? 'Wonderful fine motor practice. The kids were so proud of their caterpillars.' :
            activityId === '13' ? 'Such a gentle way to introduce scientific observation.' :
            'Perfect activity for this age group. Easy cleanup too!',
      timestamp: '6 hours ago'
    }
  ];
  
  const baseLikes = 12;
  const totalLikes = baseLikes + (isLiked ? 1 : 0);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      // Handle comment submission
      setCommentText('');
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header with ladybug image */}
      <div className="relative h-80 bg-gradient-to-b from-green-200 to-green-100">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">{activity.title}</h1>
            <p className="text-white text-lg mb-2">{activity.subtitle}</p>
            <div className="text-white text-lg">Age range: {activity.ageRange}</div>
          </div>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-30 hover:bg-opacity-50 text-white"
        >
          <XIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={activity.authorAvatar} alt={activity.author} />
            <AvatarFallback>{activity.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-semibold text-gray-800">{activity.author}</div>
            <div className="text-gray-500 text-sm">{activity.date}</div>
          </div>
          <div className="ml-auto">
            <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">EAD</span>
          </div>
        </div>

        {/* What you'll need section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">What you'll need</h2>
          <ul className="space-y-2">
            {activity.materials.map((material, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span className="text-gray-700">{material}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <ol className="space-y-4 text-gray-700">
            {activity.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-semibold text-gray-800 flex-shrink-0">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Bottom section with likes and comments */}
      <div className="bg-gray-50 px-6 py-4 space-y-4">
        {/* Like button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 hover:text-red-500 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{totalLikes} {totalLikes === 1 ? 'like' : 'likes'}</span>
          </Button>
        </div>

        {/* Comments section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Comments ({existingComments.length})</h3>
          
          {/* Existing comments */}
          <div className="space-y-4">
            {existingComments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm">{comment.author}</span>
                    <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Comment input */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-white border-gray-200 rounded-full px-4 py-2"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};