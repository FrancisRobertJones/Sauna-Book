import { motion } from "framer-motion"

interface BookingSaunaTitle {
    title: string
}

export function BookingSaunaTitle({ title }: BookingSaunaTitle) {
    return (
        <motion.h1
            className="text-5xl font-bold mb-8 text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {title}
        </motion.h1>
    )
}

