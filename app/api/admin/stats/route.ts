import { NextRequest, NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';

export async function GET(request: NextRequest) {
  try {
    // Obtener estadísticas principales
    const revenueResult = await pgQuery(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM purchases 
      WHERE status = 'completed'
    `);
    
    const usersResult = await pgQuery(`
      SELECT COUNT(DISTINCT user_email) as total 
      FROM purchases
    `);
    
    const productsResult = await pgQuery(`
      SELECT COUNT(*) as total 
      FROM products 
      WHERE is_active = true
    `);
    
    const downloadsResult = await pgQuery(`
      SELECT COUNT(*) as total 
      FROM download_history
    `);
    
    // Productos más vendidos
    const topProducts = await pgQuery(`
      SELECT 
        p.product_id,
        COALESCE(pr.company_name, 'Producto sin nombre') as company_name,
        COALESCE(pr.sector, 'Sin sector') as sector,
        COUNT(*) as sales_count,
        SUM(p.amount) as total_revenue
      FROM purchases p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.status = 'completed'
      GROUP BY p.product_id, pr.company_name, pr.sector
      ORDER BY sales_count DESC
      LIMIT 6
    `);
    
    // Estadísticas diarias (últimos 7 días)
    const dailyStats = await pgQuery(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as sales,
        SUM(amount) as revenue,
        COUNT(DISTINCT user_email) as unique_users
      FROM purchases
      WHERE status = 'completed' 
        AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Estadísticas de descargas por día
    const downloadStats = await pgQuery(`
      SELECT 
        DATE(downloaded_at) as date,
        COUNT(*) as downloads
      FROM download_history
      WHERE downloaded_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(downloaded_at)
      ORDER BY date ASC
    `);

    // Actividad reciente
    const recentActivity = await pgQuery(`
      SELECT 
        'purchase' as type,
        user_email,
        user_name,
        amount,
        created_at,
        'Nueva compra - ' || COALESCE((SELECT company_name FROM products WHERE id = product_id), 'Producto') as description
      FROM purchases
      WHERE status = 'completed'
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Calcular crecimiento (comparar con mes anterior)
    const lastMonthRevenue = await pgQuery(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM purchases 
      WHERE status = 'completed'
        AND created_at >= NOW() - INTERVAL '60 days'
        AND created_at < NOW() - INTERVAL '30 days'
    `);

    const lastMonthUsers = await pgQuery(`
      SELECT COUNT(DISTINCT user_email) as total 
      FROM purchases
      WHERE created_at >= NOW() - INTERVAL '60 days'
        AND created_at < NOW() - INTERVAL '30 days'
    `);

    // Calcular porcentajes de crecimiento
    const currentRevenue = revenueResult.rows[0]?.total || 0;
    const previousRevenue = lastMonthRevenue.rows[0]?.total || 0;
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : currentRevenue > 0 ? 100 : 0;

    const currentUsers = usersResult.rows[0]?.total || 0;
    const previousUsers = lastMonthUsers.rows[0]?.total || 0;
    const userGrowth = previousUsers > 0 
      ? ((currentUsers - previousUsers) / previousUsers) * 100 
      : currentUsers > 0 ? 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalRevenue: currentRevenue,
          totalUsers: currentUsers,
          totalProducts: productsResult.rows[0]?.total || 0,
          totalDownloads: downloadsResult.rows[0]?.total || 0,
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
          userGrowth: Math.round(userGrowth * 100) / 100,
          productGrowth: 4.1,
          downloadGrowth: 15.3
        },
        
        salesData: dailyStats.rows.map((stat: any) => ({
          date: new Date(stat.date).toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit' 
          }),
          revenue: stat.revenue || 0,
          downloads: downloadStats.rows.find((d: any) => d.date === stat.date)?.downloads || 0,
          users: stat.unique_users || 0
        })),
        
        productSales: topProducts.rows.map((product: any, index: number) => ({
          name: product.company_name,
          sales: product.sales_count || 0,
          revenue: product.total_revenue || 0,
          sector: product.sector,
          color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
        })),
        
        recentActivity: recentActivity.rows.map((activity: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: activity.type,
          description: activity.description,
          time: formatTimeAgo(activity.created_at),
          amount: activity.amount > 0 ? activity.amount : undefined,
          userEmail: activity.user_email
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener estadísticas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'ahora';
  if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays}d`;
} 