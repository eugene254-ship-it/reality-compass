import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { month: "Jul", droughtCrop: 12, soilRestore: 8, waterHarvest: 5, renewGrid: 20 },
  { month: "Aug", droughtCrop: 15, soilRestore: 12, waterHarvest: 7, renewGrid: 22 },
  { month: "Sep", droughtCrop: 18, soilRestore: 14, waterHarvest: 15, renewGrid: 25 },
  { month: "Oct", droughtCrop: 22, soilRestore: 18, waterHarvest: 28, renewGrid: 27 },
  { month: "Nov", droughtCrop: 45, soilRestore: 22, waterHarvest: 42, renewGrid: 30 },
  { month: "Dec", droughtCrop: 62, soilRestore: 25, waterHarvest: 55, renewGrid: 35 },
  { month: "Jan", droughtCrop: 78, soilRestore: 30, waterHarvest: 68, renewGrid: 38 },
  { month: "Feb", droughtCrop: 95, soilRestore: 35, waterHarvest: 72, renewGrid: 42 },
];

const VelocityChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-lg border border-border card-gradient p-6"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Knowledge Velocity</h2>
        <p className="text-sm text-muted-foreground">Adoption acceleration over time</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorDrought" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(145, 70%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(145, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(42, 100%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(42, 100%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(220, 80%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(220, 80%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRenew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(186, 80%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(186, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 18%)" />
            <XAxis dataKey="month" stroke="hsl(215, 16%, 46%)" fontSize={12} />
            <YAxis stroke="hsl(215, 16%, 46%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 40%, 9%)",
                border: "1px solid hsl(222, 25%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 92%)",
                fontSize: "12px",
              }}
            />
            <Area type="monotone" dataKey="droughtCrop" stroke="hsl(145, 70%, 45%)" fill="url(#colorDrought)" strokeWidth={2} name="Drought-Resistant Crops" />
            <Area type="monotone" dataKey="waterHarvest" stroke="hsl(42, 100%, 55%)" fill="url(#colorWater)" strokeWidth={2} name="Water Harvesting" />
            <Area type="monotone" dataKey="soilRestore" stroke="hsl(220, 80%, 60%)" fill="url(#colorSoil)" strokeWidth={2} name="Soil Restoration" />
            <Area type="monotone" dataKey="renewGrid" stroke="hsl(186, 80%, 50%)" fill="url(#colorRenew)" strokeWidth={2} name="Renewable Grid" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-3 flex-wrap">
        {[
          { label: "Drought-Resistant Crops", color: "bg-stage-validated" },
          { label: "Water Harvesting", color: "bg-stage-global" },
          { label: "Soil Restoration", color: "bg-stage-theory" },
          { label: "Renewable Grid", color: "bg-primary" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default VelocityChart;
