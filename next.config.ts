import type { NextConfig } from "next";
import { setDefaultResultOrder } from "dns";

setDefaultResultOrder("ipv4first");

const nextConfig: NextConfig = {};

export default nextConfig;
