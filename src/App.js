import React, { useState, useRef, useEffect } from 'react';
import { Cloud, Sun, CloudRain, AlertTriangle, User, MessageCircle, Send, X, Settings, MapPin, Calendar, Thermometer, Wind, Eye, Droplets, Shield, Home, Briefcase, Tractor, Building2, Plane, Car, Users, FileText, Zap, Heart, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Anchor } from 'lucide-react';

const WeatherDashboard = () => {
  const [currentStep, setCurrentStep] = useState('onboarding');
  const [userProfile, setUserProfile] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showScenarioPlanner, setShowScenarioPlanner] = useState(false);
  const chatEndRef = useRef(null);

  // Add new state for animations
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfessionModal, setShowProfessionModal] = useState(false);

  // Mock weather data with flood monitoring
  const weatherData = {
    current: {
      location: 'Chonburi, Thailand',
      temperature: 22,
      feelsLike: 24,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      windDirection: 'NE',
      visibility: 10,
      uvIndex: 6,
      pressure: 30.12,
      waterLevelTrend: 'Stable',
      floodRisk: 'Low',
      waterLevel: 'Normal',
      drainageStatus: 'Optimal',
      sunrise: '06:15',
      sunset: '18:30',
      moonPhase: 'Waxing Crescent',
      airQuality: 'Good'
    },
    forecast: [
      { day: 'Today', high: 24, low: 17, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 10, floodRisk: 'Low' },
      { day: 'Tomorrow', high: 26, low: 18, condition: 'Sunny', icon: 'sunny', precipitation: 0, floodRisk: 'Low' },
      { day: 'Wednesday', high: 23, low: 16, condition: 'Rainy', icon: 'rainy', precipitation: 85, floodRisk: 'High' },
      { day: 'Thursday', high: 21, low: 14, condition: 'Cloudy', icon: 'cloudy', precipitation: 30, floodRisk: 'Moderate' },
      { day: 'Friday', high: 24, low: 17, condition: 'Sunny', icon: 'sunny', precipitation: 5, floodRisk: 'Low' }
    ],
    alerts: [
      { type: 'warning', message: 'Heavy Rain Warning - Wednesday 3PM-6PM', severity: 'moderate' },
      { type: 'advisory', message: 'High UV Index Advisory - Next 3 Days', severity: 'low' },
      { type: 'flood', message: 'Potential Flood Risk - Wednesday Due to Heavy Rainfall', severity: 'high' }
    ],
    floodMonitoring: {
      currentLevel: 'Normal',
      trend: 'Stable',
      riskAreas: [
        { name: 'Downtown Area', risk: 'Low', status: 'Safe' },
        { name: 'Riverside District', risk: 'Moderate', status: 'Monitor' },
        { name: 'Low-lying Areas', risk: 'High', status: 'Alert' }
      ],
      drainageStatus: {
        mainSystem: 'Optimal',
        backupSystem: 'Ready',
        maintenanceStatus: 'Up to date'
      }
    },
    safeLocations: [
      { name: 'Chonburi City Hall', distance: '0.5 km', type: 'Evacuation Center', capacity: '500 people', status: 'Open' },
      { name: 'Chonburi Sports Center', distance: '1.2 km', type: 'Emergency Shelter', capacity: '1000 people', status: 'Open' },
      { name: 'Bang Saen Beach High Ground', distance: '2.3 km', type: 'Natural Safe Area', capacity: 'Unlimited', status: 'Accessible' },
      { name: 'Sriracha Hospital', distance: '3.1 km', type: 'Medical Facility', capacity: '200 people', status: 'Open' }
    ]
  };

  const professions = [
    { id: 'farmer', name: 'Farmer/Agriculture', icon: Tractor, color: 'bg-green-500' },
    { id: 'construction', name: 'Construction Worker', icon: Building2, color: 'bg-orange-500' },
    { id: 'student', name: 'Student', icon: FileText, color: 'bg-blue-500' },
    { id: 'driver', name: 'Driver', icon: Car, color: 'bg-gray-500' },
    { id: 'office', name: 'Office Worker', icon: Briefcase, color: 'bg-purple-500' },
    { id: 'event', name: 'Event Planner', icon: Users, color: 'bg-pink-500' },
    { id: 'fisherman', name: 'Fisherman', icon: Anchor, color: 'bg-cyan-500' },
    { id: 'other', name: 'Other', icon: User, color: 'bg-indigo-500' }
  ];

  const getPersonalizedSuggestions = (profile) => {
    const suggestions = {
      farmer: [
        "🌱 Optimal planting conditions today - soil moisture is perfect",
        "🚜 Wednesday's heavy rain will benefit your crops, but avoid field work",
        "☀️ High UV levels forecasted - ensure proper sun protection for outdoor work",
        "💧 Consider irrigation scheduling around tomorrow's dry conditions"
      ],
      construction: [
        "🏗️ Good conditions for concrete work today - moderate humidity levels",
        "⛈️ Halt outdoor construction Wednesday 3-6PM due to heavy rain warning",
        "🦺 High UV advisory - ensure workers have adequate sun protection",
        "🏢 Indoor work recommended during Wednesday's storm"
      ],
      student: [
        "📚 Perfect weather for outdoor study sessions today",
        "☔ Bring umbrella Wednesday - heavy rain expected during class hours",
        "🌞 Consider outdoor group study with pleasant 72°F weather",
        "🚶 Plan indoor study locations for Wednesday afternoon",
        "📝 Check flood risk areas before planning study group locations"
      ],
      driver: [
        "🚗 Good driving conditions today with clear visibility",
        "🌧️ Exercise caution Wednesday - heavy rain may cause flooding",
        "👀 Excellent visibility conditions at 10 miles",
        "⚠️ Plan alternate routes for Wednesday afternoon commute"
      ],
      office: [
        "🏢 Perfect weather for walking meetings today",
        "☔ Bring umbrella Wednesday - heavy rain expected",
        "🌞 Consider outdoor lunch breaks with pleasant 72°F weather",
        "🚗 Plan indoor activities for Wednesday afternoon"
      ],
      event: [
        "🎉 Great weather for outdoor events today and tomorrow",
        "⛈️ Postpone Wednesday outdoor events due to heavy rain warning",
        "☀️ Perfect conditions for weekend event planning",
        "🎪 Consider tent rentals for Wednesday if events can't be moved"
      ],
      fisherman: [
        "🌊 Good fishing conditions today with calm seas",
        "🌧️ Avoid fishing Wednesday due to heavy rain and rough seas",
        "🌡️ Water temperature is optimal for fishing",
        "🌪️ Watch for changing wind patterns that may affect fishing spots",
        "🌅 Best fishing times: Early morning and sunset"
      ]
    };
    return suggestions[profile.profession] || suggestions.office;
  };

  const getPersonalizedAlerts = (profile) => {
    const alerts = {
      farmer: [
        { type: 'critical', message: 'Crop Protection Alert: Heavy rain may cause flooding in low-lying fields', action: 'Review drainage systems' },
        { type: 'advisory', message: 'Optimal harvesting window: Today through Tuesday before rain arrives', action: 'Prioritize harvest schedule' }
      ],
      construction: [
        { type: 'critical', message: 'Work Safety Alert: Suspend outdoor construction during Wednesday storm', action: 'Schedule indoor tasks' },
        { type: 'warning', message: 'UV Protection Required: High exposure risk for outdoor workers', action: 'Provide sun protection gear' }
      ],
      student: [
        { type: 'critical', message: 'Campus Safety Alert: Potential flooding in low-lying areas Wednesday', action: 'Check campus flood risk map' },
        { type: 'advisory', message: 'Study Location Advisory: Indoor study spaces recommended Wednesday', action: 'Plan alternative study locations' },
        { type: 'warning', message: 'Transportation Alert: Heavy rain may affect campus shuttle service', action: 'Check shuttle schedule updates' }
      ],
      driver: [
        { type: 'critical', message: 'Road Safety Alert: Flooding expected on main routes Wednesday', action: 'Plan alternate routes' },
        { type: 'warning', message: 'Visibility Advisory: Heavy rain may reduce visibility', action: 'Ensure vehicle lights are working' }
      ],
      fisherman: [
        { type: 'critical', message: 'Marine Safety Alert: Rough seas expected Wednesday', action: 'Avoid fishing activities' },
        { type: 'warning', message: 'Weather Advisory: Strong winds may affect fishing conditions', action: 'Check local marine forecasts' },
        { type: 'advisory', message: 'Tide Schedule: Optimal fishing times available in app', action: 'Review tide charts' }
      ]
    };
    return alerts[profile.profession] || [];
  };

  const handleProfessionSelect = (profession) => {
    setUserProfile({ ...userProfile, profession: profession.id, professionName: profession.name });
    setCurrentStep('preferences');
  };

  const [tempPreferences, setTempPreferences] = useState({
    location: 'Chonburi, Thailand',
    notifications: true,
    alertLevel: 'all'
  });

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({ ...prev, ...tempPreferences }));
    setCurrentStep('dashboard');
    
    // Initialize chatbot with welcome message
    setChatMessages([{
      type: 'bot',
      message: `Welcome ${userProfile.professionName ? 'to your personalized weather dashboard! As a ' + userProfile.professionName.toLowerCase() + ', I can help you with weather-related questions.' : 'to your weather dashboard! I can help with weather questions.'}`,
      timestamp: new Date()
    }]);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      const userMessage = {
        type: 'user',
        message: inputMessage,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, userMessage]);

      // Check if user wants to connect with a real person
      if (inputMessage.toLowerCase() === 'yes') {
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            type: 'bot',
            message: "I'll connect you with our support team. Please wait a moment while we transfer you...",
            timestamp: new Date()
          }]);
        }, 1000);
        setInputMessage('');
        return;
      }

      // Check if user doesn't want to connect with a real person
      if (inputMessage.toLowerCase() === 'no') {
        setTimeout(() => {
          setChatMessages([{
            type: 'bot',
            message: `Welcome ${userProfile.professionName ? 'to your personalized weather dashboard! As a ' + userProfile.professionName.toLowerCase() + ', I can help you with weather-related questions.' : 'to your weather dashboard! I can help with weather questions.'}`,
            timestamp: new Date()
          }]);
        }, 1000);
        setInputMessage('');
        return;
      }

      // Generate bot response based on user profession and message
      setTimeout(() => {
        try {
          const botResponse = generateBotResponse(inputMessage, userProfile);
          setChatMessages(prev => [...prev, {
            type: 'bot',
            message: botResponse,
            timestamp: new Date()
          }]);
        } catch (error) {
          console.error('Error generating bot response:', error);
          setChatMessages(prev => [...prev, {
            type: 'bot',
            message: "I'm not sure I understand your question. Would you like to speak with a real person? Just type 'yes' to connect with our support team or 'no' to start over.",
            timestamp: new Date()
          }]);
        }
      }, 1000);

      setInputMessage('');
    } catch (error) {
      console.error('Error in chat submission:', error);
      setChatMessages(prev => [...prev, {
        type: 'bot',
        message: "I'm not sure I understand your question. Would you like to speak with a real person? Just type 'yes' to connect with our support team or 'no' to start over.",
        timestamp: new Date()
      }]);
    }
  };

  const generateBotResponse = (message, profile) => {
    if (!message || !profile) {
      return "I'm having trouble understanding your request. Would you like to speak with a real person?";
    }

    const lowerMessage = message.toLowerCase();
    
    // Incident reporting
    if (lowerMessage.includes('report') || lowerMessage.includes('incident')) {
      return "I'll help you file an incident report. Please provide details about the weather-related incident including location, time, and nature of the event. This information will be forwarded to relevant authorities.";
    }
    
    // Weather questions with persona-based responses
    if (lowerMessage.includes('rain') || lowerMessage.includes('storm')) {
      const responses = {
        farmer: "Heavy rain is forecasted for Wednesday 3-6PM. I recommend checking your drainage systems and consider moving livestock to higher ground if needed. This rainfall could benefit crops but may cause temporary flooding.",
        construction: "Wednesday's storm poses safety risks for outdoor construction. I recommend scheduling indoor tasks and securing equipment. The heavy rain warning is from 3-6PM.",
        student: "Heavy rain Wednesday may affect outdoor study sessions. I recommend checking campus flood risk maps and planning indoor study locations.",
        driver: "Heavy rain Wednesday may cause road flooding and reduced visibility. Plan alternate routes and allow extra travel time, especially during the 3-6PM period.",
        fisherman: "Heavy rain and storms expected Wednesday 3-6PM. Sea conditions will be rough with strong winds. I recommend staying ashore and securing your vessels. The rough seas may affect fishing grounds and create dangerous conditions for small boats. Check your moorings and ensure all equipment is properly secured."
      };
      return responses[profile.profession] || "Heavy rain is expected Wednesday 3-6PM. Take appropriate precautions for your activities.";
    }

    if (lowerMessage.includes('uv') || lowerMessage.includes('sun') || lowerMessage.includes('hot')) {
      const responses = {
        farmer: "UV index is high over the next few days. Ensure you're wearing protective clothing, wide-brimmed hats, and sunscreen during fieldwork. Consider scheduling outdoor tasks for early morning or late afternoon.",
        construction: "High UV levels pose health risks for outdoor workers. Ensure your team has adequate sun protection including sunscreen, protective clothing, and scheduled shade breaks every hour.",
        student: "High UV levels are expected. Consider indoor study locations or use sun protection if studying outdoors. Check the UV index before planning outdoor activities.",
        driver: "High UV levels may affect visibility. Ensure your vehicle's sun protection is working properly and keep sunglasses handy.",
        fisherman: "High UV levels expected today. While at sea, ensure you have adequate sun protection including UV-blocking clothing, wide-brimmed hats, and marine-grade sunscreen. Consider fishing during early morning or late afternoon when UV levels are lower. Remember that UV reflection from water can be stronger than direct sunlight."
      };
      return responses[profile.profession] || "UV index is high. Use sun protection when outdoors.";
    }

    if (lowerMessage.includes('wind')) {
      const responses = {
        fisherman: `Current wind speed is ${weatherData.current.windSpeed} km/h from the ${getWindDirection(weatherData.current.windDirection)}. This wind pattern is favorable for fishing in sheltered areas. However, be cautious of changing wind patterns that may affect sea conditions. For small vessels, consider staying closer to shore with these wind conditions.`
      };
      return responses[profile.profession] || `Current wind speed is ${weatherData.current.windSpeed} km/h, which is favorable for most activities. Wednesday's storm may bring stronger gusts.`;
    }

    if (lowerMessage.includes('flood') || lowerMessage.includes('water level')) {
      const responses = {
        fisherman: `Current water level is ${weatherData.current.waterLevel} with a ${weatherData.current.waterLevelTrend} trend. ${weatherData.floodMonitoring.riskAreas.map(area => `${area.name} is at ${area.risk} risk.`).join(' ')} For fishing activities, these conditions may affect access to usual fishing spots and could impact fish behavior. Consider checking local tide charts and adjusting your fishing locations accordingly.`
      };
      return responses[profile.profession] || `Current water level is ${weatherData.current.waterLevel} with a ${weatherData.current.waterLevelTrend} trend. ${weatherData.floodMonitoring.riskAreas.map(area => `${area.name} is at ${area.risk} risk.`).join(' ')}`;
    }

    if (lowerMessage.includes('safe') || lowerMessage.includes('shelter') || lowerMessage.includes('evacuation')) {
      const responses = {
        fisherman: `The nearest safe harbor is ${weatherData.safeLocations[0].name} (${weatherData.safeLocations[0].distance}). It's an ${weatherData.safeLocations[0].type} with capacity for ${weatherData.safeLocations[0].capacity} and is currently ${weatherData.safeLocations[0].status}. Would you like directions to this location? Remember to secure your vessel properly when seeking shelter.`
      };
      return responses[profile.profession] || `The nearest safe location is ${weatherData.safeLocations[0].name} (${weatherData.safeLocations[0].distance}). It's an ${weatherData.safeLocations[0].type} with capacity for ${weatherData.safeLocations[0].capacity} and is currently ${weatherData.safeLocations[0].status}. Would you like directions to this location?`;
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
      const responses = {
        fisherman: "For immediate marine emergency assistance, please call 1669. If you're at sea, also activate your emergency position-indicating radio beacon (EPIRB) if available. Would you like me to connect you with emergency services? Remember to provide your vessel's location and any relevant maritime information."
      };
      return responses[profile.profession] || "For immediate emergency assistance, please call 1669. Would you like me to connect you with emergency services?";
    }

    // Check if the message contains any weather-related terms
    const weatherTerms = ['weather', 'temperature', 'forecast', 'humidity', 'pressure', 'visibility', 'air quality'];
    const containsWeatherTerm = weatherTerms.some(term => lowerMessage.includes(term));
    
    if (containsWeatherTerm) {
      const responses = {
        fisherman: `Current conditions show ${weatherData.current.condition.toLowerCase()} skies with ${weatherData.current.temperature}°C. Sea temperature is optimal for fishing, and visibility is good at ${weatherData.current.visibility} km. These conditions are favorable for most fishing activities, but remember to check local tide charts for optimal fishing times. How can I assist you with your fishing plans today?`
      };
      return responses[profile.profession] || `Current conditions show ${weatherData.current.condition.toLowerCase()} skies with ${weatherData.current.temperature}°C. How can I assist you today?`;
    }

    // For unknown queries, offer to connect with a real person
    return "I'm not sure I understand your question. Would you like to speak with a real person who can better assist you? Just type 'yes' to connect with our support team or 'no' to start over.";
  };

  const WeatherIcon = ({ condition }) => {
    const icons = {
      'sunny': <Sun className="w-8 h-8 text-yellow-500 mx-auto" />,
      'partly-cloudy': <Cloud className="w-8 h-8 text-gray-400 mx-auto" />,
      'cloudy': <Cloud className="w-8 h-8 text-gray-500 mx-auto" />,
      'rainy': <CloudRain className="w-8 h-8 text-blue-500 mx-auto" />
    };
    return <div className="flex justify-center">{icons[condition] || <Sun className="w-8 h-8 mx-auto" />}</div>;
  };

  // Helper function to get temperature description
  const getTemperatureDescription = (temp) => {
    if (temp < 10) return 'Cold';
    if (temp < 15) return 'Cool';
    if (temp < 20) return 'Mild';
    if (temp < 25) return 'Warm';
    if (temp < 30) return 'Hot';
    return 'Very Hot';
  };

  // Helper function to get precipitation description
  const getPrecipitationDescription = (percentage) => {
    if (percentage === 0) return 'No rain expected';
    if (percentage < 20) return 'Light rain possible';
    if (percentage < 40) return 'Chance of rain';
    if (percentage < 60) return 'Rain likely';
    if (percentage < 80) return 'Heavy rain expected';
    return 'Severe rain expected';
  };

  // Helper function to get wind direction description
  const getWindDirection = (direction) => {
    const directions = {
      'N': 'North',
      'NE': 'Northeast',
      'E': 'East',
      'SE': 'Southeast',
      'S': 'South',
      'SW': 'Southwest',
      'W': 'West',
      'NW': 'Northwest'
    };
    return directions[direction] || direction;
  };

  // Helper function to get UV index description
  const getUVDescription = (index) => {
    if (index <= 2) return 'Low';
    if (index <= 5) return 'Moderate';
    if (index <= 7) return 'High';
    if (index <= 10) return 'Very High';
    return 'Extreme';
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your weather dashboard...</h2>
        </div>
      </div>
    );
  }

  if (currentStep === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full transform transition-all duration-500 hover:scale-[1.02]">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
              <Cloud className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-3 font-octosquares">SafeCast</h1>
            <p className="text-gray-600 text-lg">Climate intelligence, right where you need it.</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">What's your profession?</h2>
            <p className="text-gray-600 text-center mb-8">This helps us provide personalized weather insights and recommendations</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {professions.map((profession) => {
              const IconComponent = profession.icon;
              return (
                <button
                  key={profession.id}
                  onClick={() => handleProfessionSelect(profession)}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-center group transform hover:scale-105"
                >
                  <div className={`w-14 h-14 ${profession.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{profession.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'preferences') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-500 hover:scale-[1.02]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Setup Your Preferences</h2>
            <p className="text-gray-600">Customize your weather experience</p>
          </div>
          
          <form onSubmit={handlePreferencesSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  value={tempPreferences.location}
                  onChange={handlePreferenceChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your location"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Alert Level</label>
              <select 
                name="alertLevel" 
                value={tempPreferences.alertLevel}
                onChange={handlePreferenceChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Alerts</option>
                <option value="critical">Critical Only</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <input 
                type="checkbox" 
                name="notifications" 
                id="notifications" 
                checked={tempPreferences.notifications}
                onChange={handlePreferenceChange}
                className="w-5 h-5 text-green-500 rounded focus:ring-green-500 transition-all duration-200" 
              />
              <label htmlFor="notifications" className="ml-3 text-sm text-gray-700">Enable push notifications for weather updates</label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Complete Setup
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                <Cloud className="w-5 h-5 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 font-octosquares">Safecast</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShowProfessionModal(true)}
                className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>{userProfile.professionName}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-full transition-all duration-300 ${showChat ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profession Selection Modal */}
      {showProfessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 transform transition-all duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Change Profession</h2>
              <button
                onClick={() => setShowProfessionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {professions.map((profession) => {
                const IconComponent = profession.icon;
                return (
                  <button
                    key={profession.id}
                    onClick={() => {
                      setUserProfile(prev => ({ ...prev, profession: profession.id, professionName: profession.name }));
                      setShowProfessionModal(false);
                      // Update chat messages with new profession
                      setChatMessages([{
                        type: 'bot',
                        message: `Welcome to your personalized weather dashboard! As a ${profession.name.toLowerCase()}, I can help you with weather-related questions and incident reporting.`,
                        timestamp: new Date()
                      }]);
                    }}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 text-center group transform hover:scale-105 ${
                      userProfile.profession === profession.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    <div className={`w-14 h-14 ${profession.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{profession.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['overview', 'forecast', 'alerts', 'preparedness'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none ${
                activeTab === tab
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-green-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
          {/* Combined Alerts and Recommendations */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
                Active Alerts & Recommendations
              </h3>
              
              {/* Active Alerts List */}
              <div className="space-y-4 mb-6">
                {[...weatherData.alerts, ...getPersonalizedAlerts(userProfile)].map((alert, index) => (
                  <div 
                    key={`alert-or-personal-${index}`} 
                    className={`p-4 rounded-xl transform transition-all duration-300 hover:scale-[1.02] ${
                      alert.severity === 'critical' || alert.type === 'critical'
                        ? 'bg-red-50 border border-red-200' 
                        : alert.severity === 'moderate' || alert.type === 'advisory'
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : 'bg-green-50 border border-green-200'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-800">{alert.message}</div>
                    {alert.action && <div className="text-xs text-gray-600 mt-2">{alert.action}</div>}
                  </div>
                ))}
              </div>

              {/* Personalized Recommendations List */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                   <Heart className="w-6 h-6 text-red-500 mr-2" />
                   Recommendations for You
                 </h4>
                {getPersonalizedSuggestions(userProfile).map((suggestion, index) => (
                  <div 
                    key={`suggestion-${index}`} 
                    className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Zap className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Weather Information Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Current Weather */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
                  <div className="mb-6 lg:mb-0">
                    <h2 className="text-3xl font-bold text-gray-800">Current Weather</h2>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">{weatherData.current.location}</span>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <div className="text-5xl font-bold text-gray-800">{weatherData.current.temperature}°C</div>
                      <div className="flex flex-col">
                        <div className="text-xl text-gray-600">{weatherData.current.condition}</div>
                        <div className="text-sm text-gray-500">Feels like {weatherData.current.feelsLike}°C</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Sunrise</span>
                        <Sun className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="text-lg font-semibold">{weatherData.current.sunrise}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Sunset</span>
                        <Sun className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="text-lg font-semibold">{weatherData.current.sunset}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Air Quality</span>
                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">A</span>
                      </div>
                      <div className="text-lg font-semibold">{weatherData.current.airQuality}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Water Level</span>
                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">→</span>
                      </div>
                      <div className="text-lg font-semibold">{weatherData.current.waterLevelTrend}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                  <div className="min-w-0 bg-gray-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                    <Droplets className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Humidity</div>
                    <div className="text-xl font-semibold">{weatherData.current.humidity}%</div>
                    <div className="text-xs text-gray-500 mt-1">Comfortable</div>
                  </div>
                  <div className="min-w-0 bg-gray-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                    <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Wind</div>
                    <div className="text-xl font-semibold">{weatherData.current.windSpeed} km/h</div>
                    <div className="text-xs text-gray-500 mt-1">{getWindDirection(weatherData.current.windDirection)}</div>
                  </div>
                  <div className="min-w-0 bg-gray-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                    <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Visibility</div>
                    <div className="text-xl font-semibold">{weatherData.current.visibility} km</div>
                    <div className="text-xs text-gray-500 mt-1">Clear</div>
                  </div>
                  <div className="min-w-0 bg-gray-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                    <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">UV Index</div>
                    <div className="text-xl font-semibold">{weatherData.current.uvIndex}</div>
                    <div className="text-xs text-gray-500 mt-1">{getUVDescription(weatherData.current.uvIndex)}</div>
                  </div>
                  <div className="min-w-0 bg-gray-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                    <Cloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Pressure</div>
                    <div className="text-xl font-semibold">{weatherData.current.pressure} hPa</div>
                    <div className="text-xs text-gray-500 mt-1">Normal</div>
                  </div>
                  <div className="min-w-0 bg-gray-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                    <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Moon Phase</div>
                    <div className="text-xl font-semibold">{weatherData.current.moonPhase}</div>
                    <div className="text-xs text-gray-500 mt-1">Waxing</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-3">Today's Highlights</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Best time for outdoor activities: 10:00 - 15:00
                      </li>
                      <li className="flex items-center text-sm text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        UV protection recommended after 11:00
                      </li>
                      <li className="flex items-center text-sm text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Light breeze throughout the day
                      </li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-3">Health Advisory</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Good air quality for outdoor exercise
                      </li>
                      <li className="flex items-center text-sm text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Stay hydrated - moderate humidity levels
                      </li>
                      <li className="flex items-center text-sm text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        UV protection needed during peak hours
                      </li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-800 mb-3">Travel Advisory</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-yellow-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        Good driving conditions
                      </li>
                      <li className="flex items-center text-sm text-yellow-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        Clear visibility for travel
                      </li>
                      <li className="flex items-center text-sm text-yellow-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        No weather-related travel delays expected
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Forecast Section */}
            <div className="w-full bg-white rounded-2xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">5-Day Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {weatherData.forecast.map((day, index) => (
                  <div 
                    key={index} 
                    className="text-center p-6 rounded-xl bg-gray-50 transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="font-medium text-gray-800 mb-3 text-lg">{day.day}</div>
                    <div className="mb-4">
                      <WeatherIcon condition={day.icon} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-semibold text-gray-800">{day.high}°C</div>
                      <div className="text-sm text-gray-600">{day.low}°C</div>
                      <div className="text-xs text-gray-500">{getTemperatureDescription(day.high)}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-green-600 font-medium">{day.precipitation}% rain</div>
                      <div className="text-xs text-gray-500">{getPrecipitationDescription(day.precipitation)}</div>
                    </div>
                    {day.floodRisk !== 'Low' && (
                      <div className="mt-2">
                        <div className={`text-xs font-medium ${
                          day.floodRisk === 'High' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {day.floodRisk} Flood Risk
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Preparedness */}
            <div className="w-full bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-green-500 mr-2" />
                Emergency Preparedness
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Emergency Kit Checklist */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-4 text-lg">Emergency Kit Checklist</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">First Aid Supplies</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">Water (3 days supply)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">Non-perishable Food</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">Flashlight & Batteries</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">Emergency Radio</span>
                    </li>
                  </ul>
                </div>

                {/* Emergency Contacts */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-4 text-lg">Emergency Contacts</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Local Emergency</span>
                      <span className="text-green-600 font-medium">1669</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Police</span>
                      <span className="text-green-600 font-medium">191</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Fire Department</span>
                      <span className="text-green-600 font-medium">199</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Hospital</span>
                      <span className="text-green-600 font-medium">1669</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Weather Hotline</span>
                      <span className="text-green-600 font-medium">1182</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h4 className="font-semibold text-yellow-800 mb-4 text-lg">Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                      View Evacuation Routes
                    </button>
                    <button className="w-full bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                      Share Location
                    </button>
                    <button className="w-full bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                      Report Emergency
                    </button>
                    <button className="w-full bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-8">
            {/* 5-Day Forecast */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">5-Day Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {weatherData.forecast.map((day, index) => (
                  <div 
                    key={index} 
                    className="text-center p-6 rounded-xl bg-gray-50 transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="font-medium text-gray-800 mb-3 text-lg">{day.day}</div>
                    <div className="mb-4">
                      <WeatherIcon condition={day.icon} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-semibold text-gray-800">{day.high}°C</div>
                      <div className="text-sm text-gray-600">{day.low}°C</div>
                      <div className="text-xs text-gray-500">{getTemperatureDescription(day.high)}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-green-600 font-medium">{day.precipitation}% rain</div>
                      <div className="text-xs text-gray-500">{getPrecipitationDescription(day.precipitation)}</div>
                    </div>
                    {day.floodRisk !== 'Low' && (
                      <div className="mt-2">
                        <div className={`text-xs font-medium ${
                          day.floodRisk === 'High' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {day.floodRisk} Flood Risk
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Forecast */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Detailed Forecast</h3>
              <div className="space-y-6">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <WeatherIcon condition={day.icon} />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{day.day}</h4>
                          <p className="text-sm text-gray-600">{day.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold text-gray-800">{day.high}°C</div>
                        <div className="text-sm text-gray-600">Low: {day.low}°C</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-sm text-gray-600">Precipitation</div>
                        <div className="text-lg font-semibold text-green-600">{day.precipitation}%</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-sm text-gray-600">Flood Risk</div>
                        <div className={`text-lg font-semibold ${
                          day.floodRisk === 'High' ? 'text-red-600' : 
                          day.floodRisk === 'Moderate' ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>{day.floodRisk}</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-sm text-gray-600">Wind</div>
                        <div className="text-lg font-semibold text-gray-800">{weatherData.current.windSpeed} km/h</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-sm text-gray-600">Humidity</div>
                        <div className="text-lg font-semibold text-gray-800">{weatherData.current.humidity}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-8">
            {/* Active Alerts */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
                Active Alerts
              </h3>
              <div className="space-y-4">
                {weatherData.alerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl transform transition-all duration-300 hover:scale-[1.02] ${
                      alert.severity === 'critical' 
                        ? 'bg-red-50 border border-red-200' 
                        : alert.severity === 'moderate' 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : 'bg-green-50 border border-green-200'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-800">{alert.message}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Alerts */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="w-6 h-6 text-green-500 mr-2" />
                Personalized Alerts
              </h3>
              <div className="space-y-4">
                {getPersonalizedAlerts(userProfile).map((alert, index) => (
                  <div 
                    key={`personal-${index}`} 
                    className={`p-4 rounded-xl transform transition-all duration-300 hover:scale-[1.02] ${
                      alert.type === 'critical' 
                        ? 'bg-red-50 border border-red-200' 
                        : 'bg-orange-50 border border-orange-200'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-800">{alert.message}</div>
                    <div className="text-xs text-gray-600 mt-2">{alert.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preparedness' && (
          <div className="space-y-8">
            {/* Emergency Preparedness */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-green-500 mr-2" />
                Emergency Preparedness
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Emergency Kit Checklist */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-4 text-lg">Emergency Kit Checklist</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">First Aid Supplies</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">Water (3 days supply)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">Non-perishable Food</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">Flashlight & Batteries</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                      <span className="text-gray-700">Emergency Radio</span>
                    </li>
                  </ul>
                </div>

                {/* Emergency Contacts */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-4 text-lg">Emergency Contacts</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Local Emergency</span>
                      <span className="text-green-600 font-medium">1669</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Police</span>
                      <span className="text-green-600 font-medium">191</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Fire Department</span>
                      <span className="text-green-600 font-medium">199</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Hospital</span>
                      <span className="text-green-600 font-medium">1669</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-700">Weather Hotline</span>
                      <span className="text-green-600 font-medium">1182</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h4 className="font-semibold text-yellow-800 mb-4 text-lg">Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                      View Evacuation Routes
                    </button>
                    <button className="w-full bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                      Share Location
                    </button>
                    <button className="w-full bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                      Report Emergency
                    </button>
                    <button className="w-full bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Safe Locations */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MapPin className="w-6 h-6 text-green-500 mr-2" />
                Nearby Safe Locations
              </h3>
              <div className="space-y-4">
                {weatherData.safeLocations.map((location, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-green-50 rounded-xl transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{location.name}</h4>
                        <p className="text-sm text-gray-600">{location.type}</p>
                      </div>
                      <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full text-sm">
                        {location.distance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Capacity: {location.capacity}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        location.status === 'Open' 
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {location.status}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                        Get Directions
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chatbot */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transform transition-all duration-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-800">SafeBot</span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm">{message.message}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about weather or report an incident..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;