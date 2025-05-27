namespace Csoportok
{
    class diak{
        public int tanulokod { get; private set; }

        public diak(string sor) {
            string[] adatok = sor.Split(';');
            tanulokod = int.Parse(adatok[0]);
        }
    }
    internal class Program
    {
        static void Main(string[] args)
        {
            List<diak> diakok = new List<diak>();
            foreach (string sor in File.ReadAllLines("adatok.txt", Encoding.UTF8).Skip(1))
            { 
                diakok.Add(new diak(sor));
                Console.WriteLine(sor);
            }

            //1<= teso//
            var egyneltobbteso = diakok.Where(n => n.tesoszam > 1);
            
            foreach (var diak in egyneltobbteso)
            {
                Console.WriteLine($"\t{diak.nev}");
            }


            //angolos//
            diakok.Where(n => n.angol == "5. asd").ToList().ForEach(n => n.angol = "5. dsa");

            var erintettDiakok = diakok.Where(n => n.angol == "5. dsa")
                                       .OrderBy(n => n.nev)
                                       .ToList();


            //németes//
            Console.WriteLine("Az angol nyelv szerint, ahol a 2. nyelv a német");

            var nemetesek = diakok.Where(n => n.nyelv == "német") 
                                  .GroupBy(n => n.angol)
                                  .OrderBy(c => c.Key);

            foreach (var csoport in nemetesek)
            {
                Console.WriteLine($"\t{csoport.Key}");
                foreach (var diak in csoport.OrderBy(n => n.nev))
                {
                    Console.WriteLine($"\t\t{diak.nev}");
                }
            }

            //Viktor Viktor//
            var viktortars = diakok.Where(n => n.mat == "beta" && n.angol == "3. Joó" && n.nyelv == "német" && n.tesi =="F" && n.nev != "Viktor Viktor");
            foreach (var diak in viktortars) 
            {
                Console.WriteLine(diak.nev);
            }
        }
    }
}
