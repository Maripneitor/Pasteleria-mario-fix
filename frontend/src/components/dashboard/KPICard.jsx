import { DollarSign, ShoppingBag, CheckCircle, Clock, QuestionMarkCircle } from 'lucide-react'; // Switched to lucide-react for consistency

const ICON_MAP = {
    'DollarSign': DollarSign,
    'ShoppingBag': ShoppingBag,
    'CheckCircle': CheckCircle,
    'Clock': Clock,
    'QuestionMarkCircle': QuestionMarkCircle
};

const KPICard = ({ title, value, prefix = '', icon, color, bg }) => {
    const IconComponent = ICON_MAP[icon] || ICON_MAP['QuestionMarkCircle'];

    return (
        <div className="bg-white dark:bg-bakery-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex items-center justify-between border border-gray-100 dark:border-gray-700">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-bakery-50">
                    {prefix}
                    <CountUp end={value} duration={2.5} separator="," decimals={Number.isInteger(value) ? 0 : 2} />
                </h3>
            </div>
            <div className={`p-3 rounded-full ${bg} ${color}`}>
                <IconComponent className="w-6 h-6" />
            </div>
        </div>
    );
};

export default KPICard;
