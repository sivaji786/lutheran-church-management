import React from 'react';
import { Church, History, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import churchAltarImage from '../../assets/church_altar.png';
import heyerPortrait from '../../assets/2079d46a4c46beb7f537f94c35116f23e2f3d80b.png';

export function AELCPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section 
        className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.75), rgba(30, 58, 138, 0.75)), url(${churchAltarImage})`,
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Church className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white">Andhra Evangelical Lutheran Church</h1>
          </div>
          <p className="text-blue-100 text-xl">AELC</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Introduction */}
            <div className="mb-16">
              <Card className="border-green-100 shadow-lg overflow-hidden">
                <div className="grid lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-3 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <History className="w-6 h-6 text-blue-600" />
                      </div>
                      <h2 className="text-blue-900">Our Heritage</h2>
                    </div>
                    
                    <div className="space-y-4 text-slate-700">
                      <p>
                        The AELC was founded as a mission field of the then United Lutheran Church in America (ULCA) by John Christian Frederick Heyer (known as Father Heyer) on <span className="font-semibold text-blue-900">31 July 1842</span>. "Father" Heyer was deployed by the Ministerium of Pennsylvania, the oldest synod in North America.
                      </p>
                      
                      <p>
                        Work started by the North German Missionary Society in 1845 was turned over to the American Lutherans in 1850. As the work spread, Guntur became the center for general and higher education, and Rajahmundry, an old Telugu center of learning and culture, became the center for theological education.
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2 relative min-h-[300px] lg:min-h-0">
                    <img 
                      src={churchAltarImage} 
                      alt="Lutheran Church Altar" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Key Facts */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-blue-900 mb-2">400,000+</h3>
                    <p className="text-slate-600">Members</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Church className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-blue-900 mb-2">5,000+</h3>
                    <p className="text-slate-600">Parishes</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-blue-900 mb-2">Since 1927</h3>
                    <p className="text-slate-600">Constituted Church</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About AELC */}
            <div className="mb-16">
              <h2 className="text-blue-900 mb-6 text-center">About AELC</h2>
              <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-100">
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-4 text-slate-700">
                    <p>
                      The AELC was constituted in 1927. Prior to this it was a mission of the United Lutheran Church in America (now part of the ELCA). With more than 400,000 members, the AELC is considered the <span className="font-semibold text-blue-900">third largest Lutheran church in Asia</span>. It has been a member of the LWF since 1950. It is served by 250 ordained pastors and a large number of workers in areas of evangelism, education, health, and other diaconic ministries.
                    </p>

                    <p>
                      AELC's work is mainly in the state of Andhra Pradesh, a Telugu-speaking region. Evangelism is carried out through film, radio, and personal work. Bible women are effective in gaining access to Hindu and Muslim homes. The AELC runs 500 Sunday schools. Over 30,000 women regularly study the Bible and promote the Christian faith. Five ashrams give people of various castes and ethnic backgrounds opportunities to live and study together.
                    </p>

                    <p>
                      The church operates a college of education, 19 secondary schools, a school of law, and cooperates in running an interdenominational college. For vocational training, it operates an agricultural school, a sewing school, two industrial schools for boys and girls, and a Bible school.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Father Heyer Section */}
            <div className="mb-8">
              <h2 className="text-blue-900 mb-8 text-center">Our Founding Missionary</h2>
              <Card className="border-green-100 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-8">
                  <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 flex justify-center items-start">
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <img 
                          src={heyerPortrait} 
                          alt="John Christian Frederick Heyer" 
                          className="w-full rounded"
                        />
                        <p className="text-center text-slate-600 mt-3">
                          <span className="italic">July 10, 1793 – November 7, 1873</span>
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      <h3 className="text-blue-900 mb-4">John Christian Frederick Heyer</h3>
                      <p className="text-slate-600 mb-6 italic">
                        "Father Heyer" - First Lutheran Missionary Sent Abroad from the United States
                      </p>

                      <div className="space-y-4 text-slate-700">
                        <p>
                          John Christian Frederick Heyer was the first missionary sent abroad by Lutherans in the United States. He founded the Guntur Mission in Andhra Pradesh, India. "Father Heyer" is commemorated as a missionary in the Calendar of Saints of the Lutheran Church on November 7, along with Bartholomaeus Ziegenbalg and Ludwig Ingwer Nommensen.
                        </p>

                        <p>
                          Johann Christian Friedrich Heyer was born in Helmstedt, Lower Saxony, Prussia (now Germany). After being confirmed at St. Stephen's Church in Helmstedt in 1807, his parents sent him away from Napoleonic Europe to reside in America with a maternal uncle, a furrier and hatter in Philadelphia, Pennsylvania.
                        </p>

                        <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600 my-6">
                          <h4 className="text-blue-900 mb-3">Ministry Highlights</h4>
                          <ul className="space-y-2 text-slate-700">
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span>Ordained as a preacher in 1820 after studying theology in Philadelphia and Göttingen</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span>Established churches across Pennsylvania, Maryland, New York, and as far west as Missouri</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span>First pastor of the First Evangelical Lutheran Church in Pittsburgh (1837)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span>Obtained his M.D. from the University of Maryland School of Medicine in 1847</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-white rounded-lg p-6 border-l-4 border-green-600 my-6">
                          <h4 className="text-blue-900 mb-3">Mission to India</h4>
                          <ul className="space-y-2 text-slate-700">
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span><span className="font-semibold">1841:</span> Set sail for India from Boston on the ship Brenda</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span><span className="font-semibold">1847-1857:</span> Second journey to India, serving in Guntur district</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span><span className="font-semibold">1869:</span> At age 77, made his third trip to India</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span>Established hospitals and a network of schools throughout the Guntur region</span>
                            </li>
                          </ul>
                        </div>

                        <p>
                          Heyer returned to the United States in 1871. In January 1872, he was appointed chaplain and the first "house father" of the Lutheran Theological Seminary at Philadelphia. Despite his brief time among the students, he was much respected and loved by the faculty and students.
                        </p>

                        <p>
                          He died in 1873 at the age of eighty, and his body was buried beside his wife in the Friedens Lutheran Church cemetery, Friedens, Pennsylvania.
                        </p>

                        <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-lg p-6 mt-6">
                          <h4 className="text-white mb-3">Legacy</h4>
                          <p>
                            The missionary field that Heyer founded in Guntur in 1842—together with the Rajahmundry Mission founded in 1845—grew to become the Andhra Evangelical Lutheran Church (AELC), organized in 1927. By 2009, the AELC grew to become one of the largest Lutheran churches in India, and the third largest Lutheran church in Asia, boasting a membership of <span className="font-semibold">more than 2-million families (over 4.5-million individuals) in about 5,000 parishes</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}