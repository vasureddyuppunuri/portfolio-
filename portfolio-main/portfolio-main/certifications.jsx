import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const certifications = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "March 2023",
  },
  {
    title: "Google Associate Cloud Engineer",
    issuer: "Google Cloud",
    date: "July 2022",
  },
  {
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    date: "December 2021",
  },
  {
    title: "Microsoft Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    date: "May 2021",
  },
];

const Certifications = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Certifications</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="p-4 border border-gray-200 rounded-2xl shadow-lg bg-white">
              <CardContent className="flex items-center gap-4">
                <CheckCircle className="text-green-500 w-6 h-6" />
                <div>
                  <h2 className="text-lg font-semibold">{cert.title}</h2>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-xs text-gray-500">{cert.date}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
